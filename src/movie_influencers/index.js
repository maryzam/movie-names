import * as d3 from 'd3';
import { debounce } from 'lodash';

const cache = {};

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
	const data = cache[movieName];
	if (!!data) {
		drawStats(data);
		return;
	}

	const sourceUrl = `data/movies/${movieName}.json`;

	d3.json(sourceUrl)
		.then((source) => {
			cache[movieName] = source;
			drawStats(source);
		});
};

const drawStats = function(data) {

	// update scale
	const names = data.map((d) => d.name);
	const yearsRange = d3.extent(data[0].stats, (d) => d.year);
	const maxFreq = d3.max(data, (d) => d3.max(d.stats, (s) => s.freq));
	scale.years.domain(yearsRange);
	scale.freqs.domain([0, maxFreq]);
	scale.names.domain(names);

	// add/update line graphs
	const lines = $chart
					.selectAll('.name')
					.data(data, (d) => d.name);
	lines.exit().remove();

	lines.attr('d', (d) => chartBuilder(d.stats)); 

	lines.enter()
		.append('path')
		.attr('class', (d) => `name ${ (d.sex == 'F') ? 'female' : 'male' }`)
		.attr('d', (d) => chartBuilder(d.stats));

	// add/update x-axis 
	// add/update y-axis
};

const init = () => {
	
	prepareSections();

	updateSize();

	// set onScroll listener
	window.addEventListener('scroll', debounce(() => {
			const current = detectCurrentSection();
			if (!current) { return; }
			if (!sections.isActive(current)) {
				showInfluencer(current);
				sections.active = current;
			}
		}, 100)
	);

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
};

init();