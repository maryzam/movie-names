export function processMovieInfluencers(source) {
	source.sort((a, b) => (b.Total - a.Total));
	const data = [];
	for (let i = 0; i < source.length; i++) {
		const curr = source[i];
		const res = {
			name: curr.Name,
			sex: curr.Sex,
			total: curr.Total
		};
		delete curr.Total;
		delete curr.Name;
		delete curr.Sex;
		const stats = Object.keys(curr).map((year) => ({
			year: year,
			freq: curr[year] * 10000
		}));
		res["stats"] = stats;
		data.push(res);
	}
	console.log(data);
}