import * as d3 from "d3";

export function loadMovieInfluencers(titles) {

	titles.forEach((title) => {

		d3.tsv(`data/movies/${title}.tsv`)
			.then((data) => {
				console.log(title);
				processMovieInfluencers(data);
				console.log();
			})
			.catch((e) => { console.error(e); })

	})
}

export function processMovieInfluencers(source) {
	source.sort((a, b) => (b.Total - a.Total));
	const data = [];
	for (let i = 0; i < source.length; i++) {
		const curr = source[i];
		const res = {
			name: curr.Name,
			sex: curr.Sex,
			total: +curr.Total
		};
		delete curr.Total;
		delete curr.Name;
		delete curr.Sex;
		const stats = Object.keys(curr).map((year) => ({
			year: year,
			count: +curr[year]
		}));
		res["stats"] = stats;
		data.push(res);
	}
	console.log(data);
}