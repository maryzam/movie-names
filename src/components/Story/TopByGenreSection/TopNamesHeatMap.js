import React from 'react';
import * as d3 from 'd3';

const GENDERS = {
	MALE: "M",
	FEMALE: "F",
	ALL: ""
};

function getGenres(data) {
	const genres = {};
	data.forEach((item) => {
		genres[item.Genre] = true;
	});
	return Object.keys(genres);
};

class TopNamesHeatMap extends React.Component {

	state = {
		isLoading: true
	};

	data = [];
	genres = [];
	scale = {};

	setupScales = () => {
		
		const { width, height } = this.props;

		const scaleGenres = d3.scalePoint()
						.domain(this.genres)
						.range([0, width])
						.padding(0.5);

		const scaleRating = d3.scaleLinear()
						.domain([0, 9])
						.range([0, height]);

		this.scale = {
			genre: scaleGenres,
			rating: scaleRating
		};
	}

	updateScales = () => {
		const { width, height } = this.props;
		this.scale.genre.range([0, width]);
		this.scale.rating.range([0, height]);
	}

	componentDidMount() {

		d3.json("data/top_names/by_genre.json")
			.then((source) => {
				this.data = source;
				this.genres = getGenres(source);
				this.setupScales();				
				this.setState({ isLoading: false });
			});
	}

	render() {

		if (this.state.isLoading) {
			return (<div className="preloader">Loading...</div>);
		}

		this.updateScales();
		console.log(this.data);
		return (
			<figure className="viz">
				<svg width={this.props.width} height={this.props.height}>
					{ 
						this.data.map((item) => (
							<g key={`${item.Name}_${item.Sex}_${item.Genre}`}
								className="name"
								transform={`translate(${this.scale.genre(item.Genre)},${this.scale.rating(item.Rating.All)})`}>
								<rect></rect>
								<text>{ item.Name }</text>
							</g>
						)) 
					}
				</svg>
			</figure>
		);
	}

}

export default TopNamesHeatMap;