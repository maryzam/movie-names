d3.csv("data/movies/list.csv")
	.then((list) => {

		const sections = d3.select("#container")
							.selectAll("article")
								.data(list).enter()
							.append("article")
								.attr("id", (d) => d.Title.split(" ").join("_"))
								.attr("data-movie", (d) => d.Title);

		sections.each((d, i) => {

			var years = d.Years.split(",");
			var key = d.Title.split(" ").join("_");
			var path = `data/movies/${key}.tsv`;
			
			d3.tsv(path)
				.then((data) => renderSection(key, d, data))
		})

	});

function renderSection(containerId, info, data) {
	const width = 900;
	const height = 50;

	const container = d3.select(`#${containerId}`)
	
	const notes = container.append("section").attr("class", "note");
	notes.append("h2").text(info.Title);
	notes.append("p").text(`(${info.Type})`);
	
	const yearsRange = d3.extent(
			Object.keys(data[0]),
			(d) => +d);

	const scaleYears = d3.scaleLinear()
							.range([0, width])
							.domain(yearsRange);

	const maxFreq = d3.max(data, (d) => d3.max(d, (e) => e));
	const scaleFreq = d3.scaleLinear()
							.domain([0, width])
							.range([0, maxFreq]);
	const viz = container
					.append("section")
						.attr("class", "vis")
					.append("svg")
						.attr("width", width)
						.attr("height", height * data.length);

	const line = d3.line()
    				.x(function(d) { return scaleYears(d.year); })
    				.y(function(d) { return scaleRange(d.val); });

}