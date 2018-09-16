

d3.tsv("data/top1000.tsv")
  .then((source) => {

  		// prepare container
		const width = 650;
		const aspectRatio = 2 / Math.sqrt(3);
		const height = width / aspectRatio;

		const svg = d3.select("#names_triangle")
						.append("svg")
						.attr("width", width)
						.attr("height", height)
					.append("g")
						.attr("transform", `translate(${width / 2}, ${ 2 * height / 3 })`);

		// scale radius
		const totalRange = d3.extent(source, (d) => +d.total);
		const scaleRadius = d3.scaleSqrt()
								.range([1, 10])
								.domain(totalRange);

		// scale coordinates
		const triangle = {
			drama: { title: "Drama", x: Math.sqrt(3), y: 1},
			adventure: { title: "Action/Adventure", x: 0, y: -2},
			comedy: { title: "Comedy", x: -Math.sqrt(3), y: 1}
		};
		const scaleCoord = d3.scaleLinear()
						.range([0, height / 3 - 50])
						.domain([0, 1]);

		// calculate coordinates
		const minRatio = 0.5;
		const coeff = 1 / (1 - minRatio);
		const calcX = (drama, comedy, adventure) => {

			const x = drama * triangle.drama.x + 
					  comedy * triangle.comedy.x +
					  adventure * triangle.adventure.x;
			return coeff * scaleCoord(x);
		};

		const calcY = (drama, comedy, adventure) => {

			const y = drama * triangle.drama.y + 
					  comedy * triangle.comedy.y +
					  adventure * triangle.adventure.y;
			return coeff * scaleCoord(y);
		};

		// draw names
		const tooltip = d3.select("#tooltip");
		const axis = svg.append("g").attr("class", "axis");

		svg
			.append("g")
			.selectAll(".name")
			.data(source)
				.enter()
			.append("circle")
				.attr("class", (d) => `name ${(d.sex == "M" ? "male" : "female")}`)
				.attr("r", (d) => scaleRadius(+d.total))
				.attr("cx", (d) => calcX(+d.dramaRatio, +d.comedyRation, +d.actionRatio))
				.attr("cy", (d) => calcY(+d.dramaRatio, +d.comedyRation, +d.actionRatio))	
			.on("mouseover", (d) => {
				tooltip.html(`${d.name}<br/>${d.total}`);
				tooltip.style("display", "block")
					.style("left", (d3.event.pageX) + "px")		
                	.style("top", (d3.event.pageY - 30) + "px");	
			})
			.on("mouseout", (d) => {
				tooltip.style("display", "none");
			});
		
		// draw axis 
		const axisData = Object.values(triangle);
		axis
			.selectAll(".label")
			.data(axisData).enter()
			.append("text")
				.text((d) => d.title)
				.attr("transform", (d) => `translate(${scaleCoord(d.x)},${scaleCoord(d.y)})`)
				.attr("dy", (d) => d.y > 0.5 ? 10: -5);

		const triangleLine = d3.line()
						.x((d) => scaleCoord(d.x))
						.y((d) => scaleCoord(d.y))
						.curve(d3.curveLinearClosed);

		axis
			.append("path")
			.datum(axisData)
			.attr("d", triangleLine)
			.style("fill", "none")
			.style("stroke", "#dadada");

  });		