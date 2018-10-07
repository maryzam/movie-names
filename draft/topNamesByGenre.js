d3.tsv("data/top_10_by_genre.tsv")
	.then((source) => {

		const width = 960;
  		const height = 400;
  		const headOffset = 100;

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
			.append("text")
			.text("Top 10 Names by Genre")
			.attr("class", "title")
			.attr("transform", `translate(${width / 2}, ${headOffset / 3})`);

		header
			.selectAll(".genre")
				.data(genres).enter()
			.append("g")
				.attr("class", "genre")
				.attr("transform", (d) => `translate(${scaleGenres(d)},${ headOffset * 2 / 3})`)
			.append("text")
				.text((d) => d);

		// content
		const itemHeight = Math.floor((height - headOffset) / 10) - 5;
		const itemWidth = Math.floor(scaleGenres.step()) - 5;

		const content = svg.append("g")
						.attr("class", "content")
						.attr("transform", `translate(0, ${headOffset - itemHeight})`);

		const orders = {};
		source.forEach((d) => {
			const genre = d.Genre;
			if (!orders[genre]) {
				orders[genre] = {
					All: 0,
					Female: 0,
					Male: 0
				};
			}
			const info = orders[genre];
			const sex = d.Sex == "F" ? "Female" : "Male";
			d["Rating"] = {	
				All: info.All,
				Gender: info[sex]
			}
			info.All++;
			info[sex]++;
		});

		console.log(source);
		const names = content
						.selectAll(".name")
						.data(source, (d) => `${d.Name}_${d.Sex}`)
							.enter()
						.filter((d) => d.Rating.All < 10)
						.append("g")
							.attr("class", (d) => `name ${d.Sex == "F" ? "female" : "male"}`)
							.attr("transform", (d) => 
								`translate(${scaleGenres(d.Genre) - itemWidth / 2}, ${scaleRating(d.Rating.All)})`);

		names
			.append("rect")
			.attr("width", itemWidth)
			.attr("height", itemHeight);

		names
			.append("text")
			.text((d) => d.Name)
			.attr("dx", itemWidth / 2)
			.attr("dy", itemHeight / 2 + 5);


	});


function getGenres(source) {
	 var genres = {};
	 source.forEach((g, i) => { genres[g.Genre] = true; });
	 return Object.keys(genres).sort();
}