d3.tsv("data/top1000.tsv")
  .then((source) => {

  		console.log(source)
  		// prepare container
		const size = 1000;
		const offset = 50;
		const svg = d3.select("#container")
						.append("svg")
						.attr("width", size + offset * 2)
						.attr("height", size * 0.87 + offset * 2);

		// prepare scales
		var totalRange = d3.extent(source, (d) => +d.total);
		var scaleRadius = d3.scaleSqrt()
					.range([1, 10])
					.domain(totalRange);

		var scaleX = d3.scaleLinear()
						.range([offset, size + offset])
						.domain([0, 1]);

		var scaleY = d3.scaleLinear()
						.range([offset, size * 0.87 + offset])
						.domain([0, 1]);

		var calcBarycentric = function(a, b, c) {
			let x = a * 0.5 + b * 0 + c * 1;
			let y = a * 0 + b * 1 + c * 1;
			return {
				x: scaleX(x),
				y: scaleY(y)
			}
		}

		var tooltip = d3.select("#tooltip");
		svg
			.append("g")
				.selectAll(".names")
			.data(source)
				.enter()
			.append("circle")
				.attr("class", "names")
				.attr("r", (d) => scaleRadius(+d.total))
				.attr("cx", (d) => calcBarycentric(+d.dramaRatio, +d.actionRatio, +d.comedyRation).x)
				.attr("cy", (d) => calcBarycentric(+d.dramaRatio, +d.actionRatio, +d.comedyRation).y)	
				.style("fill", "white")
				.style("fill-opacity", 0.2)
				.style("stroke", (d) => d.sex == "M" ? "steelblue" : "tomato")
			.on("mouseover", (d) => {
				tooltip.html(`${d.name}<br/>${d.total}`);
				tooltip.style("display", "block")
					.style("left", (d3.event.pageX) + "px")		
                	.style("top", (d3.event.pageY - 30) + "px");	
			})
			.on("mouseout", (d) => {
				tooltip.style("display", "none");
			});
		
		var triangle = svg.append("g");
		triangle
			.append("line")
			.attr("x1", scaleX(0.5))
			.attr("y1", scaleY(0))
			.attr("x2", scaleX(0))
			.attr("y2", scaleY(1))
			.style("stroke", "grey");

		triangle
			.append("line")
			.attr("x1", scaleX(0.5))
			.attr("y1", scaleY(0))
			.attr("x2", scaleX(1))
			.attr("y2", scaleY(1))
			.style("stroke", "grey")

		triangle
			.append("line")
			.attr("x1", scaleX(0))
			.attr("y1", scaleY(1))
			.attr("x2", scaleX(1))
			.attr("y2", scaleY(1))
			.style("stroke", "grey")
  });		