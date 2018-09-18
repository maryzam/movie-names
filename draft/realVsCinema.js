
d3.tsv("data/real_vs_cinema_50.tsv")
  .then((source) => {

  		console.log(source);
  		source.sort((a,b) => (a.ratio - b.ratio));
  		// prepare container
  		const width = 700;
  		const height = 800;
  		const svg = d3.select("#real_vs_cinema")
  						.append("svg")
  							.attr("width", width)
  							.attr("height", height);

  		// prepare scales 
  		const offset = 20;
  		const labelSize = 100;
  		const scaleNames = d3.scaleLinear()
  								.domain([0, source.length])
  								.range([offset, height - offset]);

  		const scaleFrac = d3.scaleLinear()
  								.domain([0, 1])
  								.range([offset + labelSize, width-offset-labelSize]);

  		// draw lines
  		const names = svg.selectAll(".name")
  						.data(source).enter()
  						.append("g")
  							.attr("class", "name")
  							.attr("transform", (d,idx) => `translate(0,${scaleNames(idx)})`);

  		names
  			.append("line")
  			.attr("class", (d) => `line ${(+d.ratio >= 0.48 ? "real" : "cinema")}`)
  			.attr("x1", scaleFrac(0))
  			.attr("x2", (d) => scaleFrac(d.ratio) - 3);

  		names
  			.append("line")
  			.attr("class", "line base")
  			.attr("x1", (d) => scaleFrac(d.ratio) + 2)
  			.attr("x2", scaleFrac(1));

  		names
  			.append("text")
  			.attr("class", (d) => `label ${(d.sex == "M" ? "male" : "female")}`)
  			.attr("dy", 4)
  			.attr("transform", `translate(${labelSize}, 0)`)
  			.text((d) => d.name);

  		// legend
  		var legend = svg.append("g")
  						.attr("class", "legend")
  						.attr("transform", `translate(${width - labelSize},0)`);

  		legend.append("text")
  			.text("← Cinematic   |   Realistic →")
  			.attr("transform", `translate(5, ${height / 2})rotate(90)`)
  			.attr("text-anchor", "middle")
  			.style("fill", "#777");
  });	