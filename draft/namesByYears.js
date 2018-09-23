
d3.tsv("data/cinematic_by_years_50_normalized.tsv")
	.then((source) => {

		const data = source.map((d) => {
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
		});
		
		// add svg
		const width = 700;
  		const height = 50;
		const labelOffset = 50;

  		const svg = d3.select("#names_history")
  						.append("svg")
  							.attr("width", width)
  							.attr("height", height * data.length);

  		// prepare scales
  		const years = d3.extent(
  							Object.keys(data[0].Years),
  							(d) => +d);
  		const maxVal =  d3.max(
  							Object.values(data[0].Years),
  							(d) => +d);
  		console.log("maxVal " + maxVal);
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

		// draw chart for each name
		data.forEach((d, i) => {
			console.log(i);
			
			const container = svg
								.append("g")
								.attr("transform", `translate(0,${(i + 1) * height})`);
			
			const curr = Object.keys(d.Years)
									.map((y) => ({
										year: y,
										val: d.Years[y]
									}));
			container
					.append("path")
						.datum(curr)
				      		.style("fill", "none")
				      		.style("stroke", "orange")
				      		.attr("d", line); 
			container
					.append("line")
						.datum(curr)
				      		.style("fill", "none")
				      		.style("stroke", "#dadada")
				      		.attr("x2", width) 
				      		.attr("y1", height)
				      		.attr("y2", height); 
			container
					.append("text")
						.text(d.Name)
						.attr("class", `label ${(d.Sex == "F" ? "female": "male")}`)
						.attr("transform", `translate(${labelOffset - 5}, ${height - 5})`); 
		});
	});