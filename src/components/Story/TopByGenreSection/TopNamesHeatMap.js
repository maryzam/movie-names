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
	header: 20
};

function getGenres(data) {
	const genres = {};
	data.forEach((item) => {
		genres[item.Genre] = true;
	});
	return Object.keys(genres);
};

function generateKey(item) {
	return `${item.Name}_${item.Sex}_${item.Genre}`;
};

class TopNamesHeatMap extends React.Component {

	state = {
		isLoading: true,
		highlight: null,
		animDuration: 600,
		propsMode: null
	};

	data = [];
	filteredData = [];
	genres = [];
	scale = {};

	setupScales = () => {
		
		const scaleGenres = d3.scaleBand().domain(this.genres).padding(0.1);
		const scaleRating = d3.scaleBand().domain(d3.range(10)).padding(0.05);
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

	updateFilteredData() {
		const { mode } = this.props;
		const predicate = (mode == "All") ?
								(d) => (d.Rating.All < 10) :
								(d) => (d.Sex == mode);

		this.filteredData = this.data.filter(predicate);
	}

	handleNameClick = (event) => {
		const name = event.target.dataset.name;
		const highlight = (name == this.state.highlight) ? null : name;
		this.setState({ highlight });
	}

	static getDerivedStateFromProps(props, state) {
		const isModeChanged = props.mode !== state.propsMode;
		console.log()
		if (isModeChanged == state.shouldAnimate) {
			return null;
		}

		return {
			propsMode: props.mode,
			animDuration: isModeChanged ? 600 : 0
		};
	}

	componentDidMount() {

		d3.json("data/top_names/by_genre.json")
			.then((source) => {
				this.data = source;
				this.genres = getGenres(source);
				this.setupScales();	
				this.updateFilteredData();			
				this.setState({ isLoading: false });
			});
	}

	componentDidUpdate() {

		const mode = this.props.mode;
		const modeKey = (mode == "All") ? "All" : "Gender";
		const animDuration = this.state.animDuration;

		const items = d3.select(this.viz)
						.selectAll(".item")
						.data(this.filteredData, function (d) { 
							return !d ?	this.dataset.item : generateKey(d); 
						});
		// exit
		items
			.exit()
			.transition()
				.duration(animDuration)
			.style("opacity", 0)
			.attr("transform", function() {
				return `translate(${this.dataset.column},${this.dataset.row})`;
			});

		// update
		items
			.select("rect")
			.transition()
				.duration(animDuration)
			.style("fill-opacity", (d) => this.scale.appearance(d.Appearance[modeKey]));

		items
			.transition()
				.duration(animDuration)
			.attr("transform", (d) => {
				const x = this.scale.genre(d.Genre);
				const y = this.scale.rating(d.Rating[modeKey]);
				return `translate(${x},${y})`;
			})
			.style("opacity", 1);
	}

	render() {

		if (this.state.isLoading) {
			return (<div className="preloader">Loading...</div>);
		}
		
		// todo do not recalculate these items on each render
		this.updateScales();
		this.updateFilteredData();	

		const itemWidth =  this.scale.genre.bandwidth();
		const itemHeight = this.scale.rating.bandwidth();
		const itemCenter = { x: itemWidth / 2, y: itemHeight / 2 };
		
		const highlight = this.state.highlight;
		const bottom = this.props.height + 5;

		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={this.props.width} 
					height={this.props.height}>
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
						this.data.map((item) => {
							const isMale = item.Sex == "M";
							const genderClass = isMale ? " male" : " female";
							const highlightClass = highlight && (highlight !== item.Name) ? " muted" : "";
							const itemKey = generateKey(item);
							const initPos = { x: this.scale.genre(item.Genre), y: isMale ? 0 : bottom };
							return (
								<g key={ itemKey }
									data-item={ itemKey }
									data-column={ initPos.x }
									data-row={ initPos.y }
									className={`item${genderClass}${highlightClass}`}
									transform={`translate(${initPos.x},${initPos.y})`}
									style={{ opacity: 0 }}
									onClick={ this.handleNameClick }>
									<rect 
										data-name={item.Name}
										width={itemWidth}
										height={itemHeight}
										style={{ fillOpacity: 0.1 }}>
									</rect>
									<text dx={itemCenter.x} dy={itemCenter.y}>
										{ item.Name }
									</text>
								</g>
							)
						}) 
					}
					</g>
				</svg>
			</figure>
		);
	}

}

export default TopNamesHeatMap;