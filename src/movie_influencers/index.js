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
	freqs: d3.scaleLinear()
};

const chartBuilder = d3.area()
						.x((d) => scale.years(d.year))
						.y1((d) => scale.freqs(d.freq))
						.curve(d3.curveCardinal);

const sections = {
	active: null,
	all: {},
	isActive: (current) => (current == sections.active)
};

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
	const yearsRange = d3.extent(data[0].stats, (d) => d.year);
	const fromYear = Math.max(keyYears.range.from || yearsRange[0], yearsRange[0]);
	const tillYear = Math.min(keyYears.range.till || yearsRange[1], yearsRange[1]);
	const predicate = (s) => (s.year >= fromYear && s.year <= tillYear);

	const names = data.map((d) => d.name);
	const maxFreq = d3.max(data, (d) => d3.max(d.stats.filter(predicate), (s) => s.freq));

	
	scale.years.domain([fromYear, tillYear]);
	scale.freqs.domain([0, maxFreq]);
	scale.names.domain(names);

	// add/update line graphs
	const curvies = $chart.select('.chart')
						.selectAll('.name')
						.data(data, (d) => d.name);

	curvies.exit().remove();

	curvies
		.transition()
			.delay(animSettings.delay)
			.duration(animSettings.duration)
		.attr('d', (d) => chartBuilder(d.stats)); 

	const initState = d3.range(fromYear, tillYear + 1).map((year) => ({ year, freq: 0}));
	curvies.enter()
		.append('path')
		.attr('class', (d) => `name ${ (d.sex == 'F') ? 'female' : 'male' }`)
		.attr('d', chartBuilder(initState))
		.transition()
			.delay(animSettings.delay)
			.duration(animSettings.duration)
		.attr('d', (d) => {
			const stats = d.stats.filter(predicate);
			return chartBuilder(stats);
		});

	// add/update key years 
	const lines = $chart.select('.key-lines')
					.selectAll('.key-year')
					.data(keyYears.dates, (d) => d);

	lines.exit().remove();

	lines.enter()
		.append('line')
			.attr('class', 'key-year')
			.attr("x1", (d) => scale.years(d)) 
			.attr("x2", (d) => scale.years(d)) 
			.attr("y1", scale.freqs(0))
			.attr("y2", scale.freqs(0))
			.transition()
				.delay(animSettings.delay)
				.duration(animSettings.duration)
			.attr("y1", scale.freqs(maxFreq))

	lines
		.transition()
			.delay(animSettings.delay)
			.duration(animSettings.duration)
		.attr("x1", (d) => scale.years(d)) 
		.attr("x2", (d) => scale.years(d));

	// add/update x-axis 
	const yearAxis = d3.axisBottom(scale.years)
						.tickFormat((d) => d)
						.tickSizeOuter(0);
	$chart
		.select('.years-axis')
		.transition()
			.delay(animSettings.delay)
			.duration(animSettings.duration)
		.call(yearAxis);
	// add/update y-axis
};

const init = () => {

	prepareSections();
	prepareContainers();
	updateSize();

	d3.json('data/movies/key-dates.json')
		.then((keyDates) => {
			cache.keyDates = keyDates;
			setOnScrollHandlers();
			updateSectionChart();
		})
};

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
	const labels = { x: 25, y: 70 };
	const paddings = { x: 10, y: 10 };

	const size = d3.select("body").node().getBoundingClientRect();

	//update scale
	scale.names.range([paddings.y, (size.height - paddings.y - labels.x)]);
	scale.years.range([ (paddings.x + labels.y), (size.width - paddings.x) ]);
	scale.freqs.range([ (size.height - paddings.y - labels.x), paddings.y]);

	chartBuilder.y0(scale.freqs(0));

	// update container
	$chart
		.attr("width", Math.floor(size.width))
		.attr("height", Math.floor(size.height));

	$chart
		.select('.years-axis')
		.attr('transform', `translate(0, ${scale.freqs(0)})`);
};

init();