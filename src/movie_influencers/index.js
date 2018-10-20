import * as d3 from 'd3';
import { debounce } from 'lodash';

const animSettings = {
	delay: 0,
	duration: 600
};

const cache = {
	movies: {},
	keyDates: []
};

const scale = {
	names: d3.scaleBand(),
	years: d3.scaleLinear(),
	count: d3.scaleLinear()
};

const chartBuilder = d3.area()
						.x((d) => scale.years(d.year))
						.y0((d) => scale.count(0))
						.y1((d) => scale.count(d.count))
						.curve(d3.curveCardinal.tension(0.25));
const sections = {
	active: null,
	all: {},
	isActive: (current) => (current == sections.active)
};

const state = {
	isSeparate: true
}

const $container = d3.select("#movie_influencers");
const $chart = $container.select(".viz").append('svg');

const showInfluencer = function(movieName) {

	const keyYears = cache.keyDates.find((d) => d.title == movieName);

	const data = cache.movies[movieName];
	if (!!data) {
		drawStats(data, keyYears);
		return;
	}

	const sourceUrl = `data/movies/${movieName}.json`;

	d3.json(sourceUrl)
		.then((source) => {
			cache.movies[movieName] = source;
			drawStats(source, keyYears);
		});
};

const drawStats = function(data, keyYears) {
	// update scale
	const yearsRange = d3.extent(data[0].stats, (d) => +d.year);
	const names = data.map((d) => d.name);
	const maxCount = d3.max(data, (d) => d3.max(d.stats, (s) => s.count));

	scale.years.domain(yearsRange);
	scale.count.domain([maxCount, 0]);
	scale.names.domain(names);

	if (state.isSeparate) {
		drawCurveSeparately(data, yearsRange);
		drawNameAxis(data);
	} else {
		drawCurve(data, yearsRange);
	}

	drawKeyLines(keyYears, maxCount);
	drawYearAxis();
};

const drawCurve = (data, yearsRange) => {
	scale.count.range(scale.names.range());
	
	const curvies = $chart.select('.chart')
						.selectAll('.name')
						.data(data, (d) => d.name);

	curvies.exit().remove();

	curvies
		.transition()
			.delay(animSettings.delay)
			.duration(animSettings.duration)
		.attr('d', (d) => chartBuilder(d.stats))
		.attr('transform', "translate(0, 0)")
		.style("fill-opacity", (d) => d.total > 100 ? 0.5 : 0.2); 

	const initState = d3.range(yearsRange[0], yearsRange[1] + 1).map((year) => ({ year, count: 0}));
	curvies.enter()
		.append('path')
		.attr('class', (d) => `name ${ (d.sex == 'F') ? 'female' : 'male' }`)
		.attr('d', chartBuilder(initState))
		.transition()
			.delay(animSettings.delay)
			.duration(animSettings.duration)
		.attr('d', (d) => chartBuilder(d.stats))
		.style("fill-opacity", (d) => d.total > 100 ? 0.5 : 0.2);
};

const drawCurveSeparately = (data, yearsRange) => {
	scale.count.range([0, (scale.names.bandwidth() - 5)]);
	
	const curvies = $chart
						.select('.chart')
						.selectAll('.name')
						.data(data, (d) => d.name);

	const separateBuilder = (d) => {
		const maxCount = d3.max(d.stats, (s) => s.count);
		scale.count.domain([maxCount, 0]);
		return chartBuilder(d.stats);
	}

	curvies.exit().remove();

	curvies
		.transition()
			.delay(animSettings.delay)
			.duration(animSettings.duration)
		.attr('d', separateBuilder)
		.attr('transform', (d) => `translate(0, ${scale.names(d.name)})`)
		.style("fill-opacity", (d) => d.total > 100 ? 0.5 : 0.2); 

	const initState = d3.range(yearsRange[0], yearsRange[1] + 1).map((year) => ({ year, count: 0}));
	curvies.enter()
		.append('path')
		.attr('class', (d) => `name ${ (d.sex == 'F') ? 'female' : 'male' }`)
		.attr('d', chartBuilder(initState))
		.attr('transform', (d) => `translate(0, ${scale.names(d.name)})`)
		.style("fill-opacity", 0.2)
		.transition()
			.delay(animSettings.delay)
			.duration(animSettings.duration)
		.attr('d', separateBuilder)
		.style("fill-opacity", (d) => d.total > 100 ? 0.5 : 0.2);
};

const drawYearAxis = () => {

	const yearAxis = d3.axisBottom(scale.years)
						.tickFormat((d) => d)
						.tickSizeOuter(0);
	const chartBottom = scale.names.range()[1];
	$chart
		.select('.years-axis')
		.transition()
			.delay(animSettings.delay)
			.duration(animSettings.duration)
		.call(yearAxis);
}

const drawNameAxis = (data) => {
	const names = $chart
					.select('.names-axis')
					.selectAll('.name-label')
					.data(data, d => d.name);

	names.exit().remove();

	const center = scale.names.bandwidth() / 2;
	const labels = names.enter()
					.append('text')
					.attr("class", "name-label")
					.attr("transform", (d) => `translate(0, ${ Math.floor(scale.names(d.name) + center)})`)
					.style("text-anchor", "end");

	labels.append('tspan').text((d) => d.name);
	labels.append('tspan')
			.text((d) => `(total: ${d.total })`)
			.attr("x", 0)
			.attr("dy", "1em");
}

const drawKeyLines = (keyYears, maxCount) => {

	const lines = $chart.select('.key-lines')
					.selectAll('.key-year')
					.data(keyYears.dates, (d) => d);

	const chartRange = scale.names.range();

	lines.exit().remove();

	lines.enter()
		.append('line')
			.attr('class', 'key-year')
			.attr("x1", (d) => scale.years(d)) 
			.attr("x2", (d) => scale.years(d)) 
			.attr("y1", chartRange[0])
			.attr("y2", chartRange[0])
			.transition()
				.delay(animSettings.delay)
				.duration(animSettings.duration)
			.attr("y1", chartRange[1])

	lines
		.transition()
			.delay(animSettings.delay)
			.duration(animSettings.duration)
		.attr("x1", (d) => scale.years(d)) 
		.attr("x2", (d) => scale.years(d));
};

const init = () => {

	prepareSections();
	prepareContainers();
	setupToggleButton();
	updateSize();

	d3.json('data/movies/key-dates.json')
		.then((keyDates) => {
			cache.keyDates = keyDates;
			setOnScrollHandlers();
			updateSectionChart();
		})
};

const setupToggleButton= () => {
	console.log("setupToggleButton");
	$container
		.select(".switch")
		.select("button")
		.on("click", () => {
			state.isSeparate = !state.isSeparate;
			showInfluencer(sections.active);
		});
}

const updateSectionChart =() => {
	const current = detectCurrentSection();
	if (!current) { return; }
	if (!sections.isActive(current)) {
		showInfluencer(current);
		sections.active = current;
	}
};

const setOnScrollHandlers = () => {
	window.addEventListener('scroll', debounce(updateSectionChart, 100));
};

const prepareSections = () => {
	d3.selectAll('.note-container')
		.nodes()
		.forEach((node, i) => {
			const dim = node.getBoundingClientRect();
			const $node = node.querySelector('.note');
			const movie = $node.dataset.movie;
			if (movie && movie.length > 0) {
				sections.all[movie] = {
					top: Math.round(dim.top),
					bottom: Math.round(dim.bottom)
				}
			}
		});
};

const prepareContainers = () => {
	$chart.append('g').attr('class', 'chart');
	$chart.append('g').attr('class', 'key-lines');
	$chart.append('g').attr('class', 'names-axis');
	$chart.append('g').attr('class', 'years-axis');
	$chart.append('g').attr('class', 'names-axis');
}

const detectCurrentSection = () => {
	const top  = window.scrollY || document.documentElement.scrollTop || 0;
	const center = Math.round(top + (screen.height / 2));
	for (let movie in sections.all) {
		const section = sections.all[movie];
		if (center > section.top && center < section.bottom) {
			return movie;
		}
	};
};

const updateSize = () => {

	// get current size
	const labels = { x: 25, y: 100 };
	const paddings = { x: 10, y: 10 };

	const size = d3.select("body").node().getBoundingClientRect();

	//update scale
	const chartBottom = (size.height - paddings.y - labels.x);
	scale.names.range([ paddings.y, chartBottom]);
	scale.count.range([ paddings.y, chartBottom]);
	scale.years.range([ (paddings.x + labels.y), (size.width - paddings.x) ]);

	// update container
	$chart
		.attr("width", Math.floor(size.width))
		.attr("height", Math.floor(size.height));

	$chart
		.select('.years-axis')
		.attr('transform', `translate(0, ${chartBottom})`);

	$chart
		.select('.names-axis')
		.attr('transform', `translate(${labels.y}, 0)`);
};

init();