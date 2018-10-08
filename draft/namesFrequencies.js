d3.json("data/freqs/names_frequency_by_genres.json")
	.then((source) => {
		console.log("source");
		const skipedTypes = { "Reality-TV": true, "News": true, "Game-Show": true, "Talk-Show": true, "Film-Noir": true };
    	const data = source.filter((d) => !skipedTypes[d.Type]);

		const height = 500;
		const width = 900;
		const labelOffset = 100

		const container = d3.select("#container")
							.append("svg")
								.attr("width", width)
								.attr("height", height);
		
		const maxFreq = d3.max(data, (d) => d3.max(d.Frequencies, (v) => v));
		console.log(maxFreq);
		const scaleFreq = d3.scaleLinear()
							.domain([0, maxFreq])
							.range([height - 20, 20]);

		const scalePos = d3.scaleLinear()
							.domain([0, data[0].Frequencies.length])
							.range([labelOffset, width * 3]);

		const lineBuilder = d3.line()
								.x((d, i) => scalePos(i))
    							.y((d, i) => scaleFreq(d))
    							.curve(d3.curveBasis);

		const items = container
			.selectAll(".freqs")
			.data(data, (d) => d.Type)
				.enter()
			.append("g")
				.attr("class", "freqs");

		items.append("path")
			.attr("d", (d) => lineBuilder(d.Frequencies))
			.style("stroke", (d) => d.IsReal ? "black" : "orange")
			.style("stroke-width", (d) => d.IsReal ? 2 : 1);

		items.append("text")
			.text((d) => d.Type)
			.attr("transform", (d) => `translate(${labelOffset - 5}, ${scaleFreq(d.Frequencies[0])})`)

		// base line
		container
			.append("line")
			.attr("x1", labelOffset)
			.attr("y1", scaleFreq(0))
			.attr("x2", width)
			.attr("y2", scaleFreq(0))
			.style("stroke", "#999")
	});