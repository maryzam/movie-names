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
	const width = 750;
	const height = 50;
	const labelOffset = 100;
	const bottomLabelOffset = 20;
	const vizHeight = height * data.length + bottomLabelOffset;

	const container = d3.select(`#${containerId}`)
	
	const notes = container.append("section").attr("class", "note");
	notes.append("h2").text(info.Title);
	notes.append("p").text(`(${info.Type})`);
	
	const yearsRange = d3.extent(
			Object.keys(data[0]),
			(d) => +d);

	const scaleYears = d3.scaleLinear()
							.range([labelOffset, width])
							.domain(yearsRange);

	const scaleFreq = d3.scaleLinear()
							.range([height, height * 0.1]);
	const viz = container
					.append("section")
						.attr("class", "vis")
					.append("svg")
						.attr("width", width)
						.attr("height", vizHeight);

	const line = d3.line()
    				.x(function(d) { return scaleYears(d.year); })
    				.y(function(d) { return scaleFreq(d.val); });

    data.forEach((source, idx) => {

    	const name = source.Name;
    	const sex = source.Sex;
    	const stats = Object.keys(source)
    				.filter((k) => !isNaN(+k))
    				.map((y) => ({ year: +y, val: +source[y]}));
    	const maxFreq = d3.max(stats, (d) => d.val);
    	scaleFreq.domain([0, maxFreq]);
    	const ph = viz.append("g")
    					.attr("transform", `translate(0, ${idx * height})`);

    	ph.append("text")
    		.text(name)
			.attr("class", `label ${(sex == "F" ? "female": "male")}`)
    		.attr("transform", `translate(${labelOffset},${height / 2})`);

    	ph.append("line")
    		.style("fill", "none")
			.style("stroke", "#999")
			.attr("x1", labelOffset) 
			.attr("x2", width) 
			.attr("y1", height)
			.attr("y2", height); 

		ph.append("path")
			.datum(stats)
			    .style("fill", "none")
			    .style("stroke", "orange")
			    .attr("d", line);
    });

    const keyYears = info.Years.split(",").map((d) => +d);
    const axis = viz.append("g")
    	.selectAll(".year")
    		.data(keyYears).enter()
    	.append("g")
    		.attr("transform", d => `translate(${scaleYears(d)}, 0)`);

    axis.append("text")
    	.text(d => d)
    	.style("font-size", "10px")
    	.style("text-anchor", "middle")
    	.attr("dy", vizHeight);

    axis.append("line")
    	.attr("y2", vizHeight - bottomLabelOffset)
    	.style("stroke", "black")
    	.style("stroke-dasharray", "1 2")
}