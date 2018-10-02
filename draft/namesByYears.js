
Promise.all([
		d3.tsv("data/cinematic_by_years_200_normalized.tsv"),
		d3.tsv("data/real_by_years_200_normalized.tsv"),
	])
	.then((source) => {

		const cinematic = prepare(source[0]);
		const real = prepare(source[1]);
		const commonNames = [];
		cinematic.forEach((d, i) => {
			if (real.some((x) => x.Name == d.Name && x.Sex == d.Sex)) {
				commonNames.push(d.Name); 
			}
		});
		
		// add svg
		const width = 700;
  		const height = 50;
		const labelOffset = 50;

  		const svg = d3.select("#names_history")
  						.append("svg")
  							.attr("width", width)
  							.attr("height", height * commonNames.length);

  		// prepare scales
  		const years = d3.extent(
  							Object.keys(cinematic[0].Years),
  							(d) => +d);
  		const maxVal =  d3.max(
  							Object.values(cinematic[0].Years),
  							(d) => +d);

		const scaleYears = d3.scaleLinear()
							.domain(years)
							.range([labelOffset, width]);
		const scaleRange = d3.scaleLinear()
							.domain([maxVal, 0])
							.range([0, height]);
		//prepare line
		const line = d3.line()
    						.x(function(d) { return scaleYears(d.year); })
    						.y(function(d) { return scaleRange(d.val); });

    	// draw axis 
    	const labeledYears = Object
    							.keys(cinematic[0].Years)
								.filter((x) => (+x % 5 == 0))
		const axis = svg
			.append("g")
				.attr("class", "axis")
			.selectAll(".year")
				.data(labeledYears).enter()
			.append("g")
				.attr("class", "year")
				.attr("transform", (d) => `translate(${scaleYears(d)}, 0)`);

		axis
			.append("line")
			.attr("y2", height * commonNames.length)
			.style("fill", "none")
			.style("stroke", "#efefef");

		axis
			.append("text")
			.text((d) => d)
			.attr("dy", 10)

		// draw chart for each name
		commonNames.forEach((name, i) => {
			
			const container = svg
								.append("g")
								.attr("transform", `translate(0,${(i + 1) * height})`);
			const cData = cinematic.find((x) => x.Name == name);
			const rData = real.find((x) => x.Name == name);
			const cCurr = Object.keys(cData.Years) 
									.map((y) => ({
										year: y,
										val: +cData.Years[y]
									}));
			const rCurr = Object.keys(rData.Years) 
									.map((y) => ({
										year: y,
										val: +rData.Years[y]
									}));
			container
					.append("path")
						.datum(rCurr)
				      		.style("fill", "none")
				      		.style("stroke", "black")
				      		.attr("d", line); 
			container
					.append("path")
						.datum(cCurr)
				      		.style("fill", "none")
				      		.style("stroke", "orange")
				      		.attr("d", line);
			container
					.append("line")
				      		.style("fill", "none")
				      		.style("stroke", "#999")
				      		.attr("x2", width) 
				      		.attr("y1", height)
				      		.attr("y2", height); 
			container
					.append("text")
						.text(cData.Name)
						.attr("class", `label ${(cData.Sex == "F" ? "female": "male")}`)
						.attr("transform", `translate(${labelOffset - 5}, ${height - 5})`);
		});
	});

	function prepare(source) {
		return source.map((d) => {
			const info = {
				Name: d.Name,
				Sex: d.Sex,
				Total: d.Total,
				Years: Object.assign({}, d)
			};
			delete info.Years.Name;
			delete info.Years.Sex;
			delete info.Years.Total;
			return info;
		})
	}