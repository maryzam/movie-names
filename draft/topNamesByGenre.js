d3.json("data/top_10_by_genre.json")
	.then((source) => {

		const width = 960;
  		const height = 400;
  		const headOffset = 70;

  		// prepare
		const genres = getGenres(source);

		const scaleGenres = d3.scalePoint()
						.domain(genres)
						.range([0, width])
						.padding(0.5);

		const scaleRating = d3.scaleLinear()
						.domain([0, 9])
						.range([0, (height - headOffset)]);

		const svg = d3.select("#top_names_by_genre")
						.append("svg")
							.attr("width", width)
							.attr("height", height);

		// header
		const header = svg.append("g")
							.attr("class", "header");

		header
			.selectAll(".genre")
				.data(genres).enter()
			.append("g")
				.attr("class", "genre")
				.attr("transform", (d) => `translate(${scaleGenres(d)},${ headOffset / 3})`)
			.append("text")
				.text((d) => d);

		// content
		const itemHeight = Math.floor((height - headOffset) / 10);
		const itemWidth = Math.floor(scaleGenres.step()) - 10;

		const content = svg.append("g")
						.attr("class", "content")
						.attr("transform", `translate(0, ${headOffset - itemHeight})`);

		const scaleAppearance = d3.scaleLinear()
									.domain([0, genres.length])
									.range([0.1, 1]);

		// onclick
		const btns = d3.select("#top_names_mode_switch")
						.selectAll("button")
						.on("click", () => {
							const curr = d3.select(d3.event.target);
							btns.attr("class", "");	
							curr.attr("class", "active");

							const mode = curr.attr("value");
							renderNames(mode);						
						});

		btns.node().click();

		function renderNames(mode /*All, F, M*/) {
			const predicate = (mode == "All") ?
								(d) => (d.Rating.All < 10) :
								(d) => (d.Sex == mode);

			const type = (mode == "All") ? "All" : "Gender";

			const filteredData = source.filter(predicate);

			const names = content
						.selectAll(".item")
						.data(filteredData, (d) => `${d.Name}_${d.Sex}_${d.Genre}`);

			//remove old
			names.exit()
				.transition()
					.duration(200)
      				.style("fill-opacity", 1e-6)
      				.remove();

      		//update old elements
      		names
      			.transition()
      				.duration(600)
      			.attr("transform", (d) => `translate(${scaleGenres(d.Genre) - itemWidth / 2}, ${scaleRating(d.Rating[type])})`);

      		names
      			.select("rect")
      			.transition()
      				.duration(600)
				.style("opacity", (d) => scaleAppearance(d.Appearance[type]));


      		// enter new elements
      		const newLabels = names.enter()
					.append("g")
						.attr("class", (d) => `item ${d.Sex == "F" ? "female" : "male"}`)
						.attr("transform", (d) => `translate(${scaleGenres(d.Genre) - itemWidth / 2}, ${height})`);

			newLabels
				.transition()
					.delay(200)
					.duration(600)
				.attr("transform", (d) => 
						`translate(${scaleGenres(d.Genre) - itemWidth / 2}, ${scaleRating(d.Rating[type])})`);

			newLabels
				.append("rect")
					.attr("width", itemWidth)
					.attr("height", itemHeight)
					.style("opacity", (d) => scaleAppearance(d.Appearance[type]));

			newLabels
				.append("text")
				.text((d) => d.Name)
					.attr("dx", itemWidth / 2)
					.attr("dy", itemHeight / 2 + 5)
					.attr("stroke", "none")
					.attr("fill", "black");
		}
		
	});


function getGenres(source) {
	 var genres = {};
	 source.forEach((g, i) => { genres[g.Genre] = true; });
	 return Object.keys(genres).sort();
}