import * as d3 from 'd3';
import { debounce } from 'lodash';

const cache = {};

const scale = {
	names: d3.scaleBand(),
	years: d3.scaleLinear(),
	freqs: d3.scaleLinear()
};

const sections = {
	active: null,
	all: {},
	isActive: (d) => (d == current)
};

const $container = d3.select("#movie_influencers");
const $chart = $constiner.select("figure").append("svg");

const showInfluencer = function(movieName) {

	const data = cache[movieName];
	if (!!data) {
		drawStats(data);
		return;
	}

	const sourceUrl = `data/movies/${movieName}.tsv`;

	d3.tsv(sourceUrl)
		.then((source) => {
			cache[movieName] = source;
			drawStats(source);
		});

};

const drawStats = function(data) {

	console.log(data);

	// update scales
	// add/update line graphs
	// add/update x-axis 
	// add/update y-axis
};

const init = () => {
	
	updateSize();
	prepareSections();

	// set onScroll listener
	window.addEventListener('scroll', debounce(() => {
			const current = detectCurrentSection();
			if (!sections.isActive(current)) {
				showInfluencer(current);
			}
		}, 150)
	);

};

const detectCurrentSection = () => {

}

const updateSize = () => {

	// get current size
	const labels = { x: 25, y: 70 };
	const paddings = { x: 10, y: 10 };

	const size = d3.select("body").node().getBoundingClientRect();

	//update scales
	scales.names.range([padding, (size.height - padding - labels.y)]);
	scales.years.range([ (padding + labels.y), (size.width - padding) ]);
	scales.freqs.range([(size.height - padding - labels.y), padding]);

	// update container
	$chart
		.attr("width", size.width)
		.attr("height", size.height);
}