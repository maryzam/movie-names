import React from 'react';
import * as d3 from 'd3';

const GENDERS = {
	MALE: "M",
	FEMALE: "F",
	ALL: ""
};

const offset = {
	x: 10,
	y: 10,
	header: 50
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
		
		const scaleGenres = d3.scaleBand().domain(this.genres);
		const scaleRating = d3.scaleLinear().domain([0, 10]);
		const scaleAppearance = d3.scaleLinear()
									.domain([0, this.genres.length])
									.range([0.1, 1]);
		this.scale = {
			genre: scaleGenres,
			rating: scaleRating,
			appearance: scaleAppearance
		};

		this.updateScales();
	}

	updateScales = () => {
		const { width, height } = this.props;
		this.scale.genre.range([offset.x, width - offset.x]);
		this.scale.rating.range([offset.header + offset.y, height - offset.y]);
	}

	getFilteredData() {

		const predicate = (this.props.mode == "All") ?
								(d) => (d.Rating.All < 10) :
								(d) => (d.Sex == mode);

		return this.data.filter(predicate);
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

		const itemWidth =  this.scale.genre.bandwidth();
		const itemHeight = this.scale.rating(1) - this.scale.rating(0);
		const itemCenter = { x: itemWidth / 2, y: itemHeight / 2 };

		const mode = this.props.mode;
		const data = this.getFilteredData();

		return (
			<figure className="viz">
				<svg width={this.props.width} height={this.props.height}>
					<g className="header">
						{
							this.genres.map((genre) => (
								<text key={genre}
									transform={`translate(${this.scale.genre(genre) + itemCenter.x},${offset.header})`}>
									{ genre }
								</text>
							))
						}
					</g>
					<g className="">
					{ 
						data.map((item) => (
							<g key={`${item.Name}_${item.Sex}_${item.Genre}`}
								className={`item ${item.Sex == "M" ? "male" : "female"}`}
								transform={`translate(${this.scale.genre(item.Genre)},${this.scale.rating(item.Rating.All)})`}>
								<rect 
									width={itemWidth}
									height={itemHeight}
									style={{fillOpacity: this.scale.appearance(item.Appearance[mode])}}>
								</rect>
								<text dx={itemCenter.x} dy={itemCenter.y}>
									{ item.Name }
								</text>
							</g>
						)) 
					}
					</g>
				</svg>
			</figure>
		);
	}

}

export default TopNamesHeatMap;