import React from 'react';
import * as d3 from 'd3';

const minRatio = 0.5;
const coeff = 1 / (1 - minRatio);
const triangle = {
					drama: { title: "Drama", x: Math.sqrt(3), y: 1},
					adventure: { title: "Action/Adventure", x: 0, y: -2},
					comedy: { title: "Comedy", x: -Math.sqrt(3), y: 1}
				};

class GenresTriangle extends React.Component {

	state = {
		isLoading: true
	}

	data = [];
	scale = {
		radius: d3.scaleSqrt(),
		coords: d3.scaleLinear()
	};

	triangleLine = d3.line()
						.x((d) => this.scale.coords(d.x))
						.y((d) => this.scale.coords(d.y))
						.curve(d3.curveLinearClosed);

	componentDidMount() {
		d3.tsv("data/triangle/top1000.tsv")
			.then((source) => {
				this.data = source;
				this.setupScales();	
				this.setState({ isLoading: false });
			})
			.catch((err) => {
				console.error(err);
			});
	}

	render() {

		if (this.state.isLoading) {
			return (<div className="preloader">Loading...</div>);
		}

		this.updateScales();

		const { width, height } = this.props.size;
		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={ width }
					height={ height }>
					<g transform= {`translate(${width / 2}, ${ 2 * height / 3 })`}>
						{ this.renderAxis() }
					 	{ this.renderNames() }
					</g>
				</svg>
			</figure>
		);
	}

	renderAxis() {
		const axisData = Object.values(triangle);
		return (
			<g className="axis">
				<path d={ this.triangleLine(axisData) }></path>
				{
					axisData.map((item) => (
						<text key={ item.title }
							className="label"
							transform={`translate(${ this.scale.coords(item.x) },${ this.scale.coords(item.y) })`}
							dy={ item.y > 0.5 ? 15 : -5 }>
								{ item.title }
						</text>
					))
				}
			</g>
		);
	}

	renderNames() {
		return (
			<g className="names">
				{
					this.data.map((item) => {
						const coords = this.getCoordinates(item);
						return (
							<circle key={`${item.name}_${item.sex}`}
								className={`${(item.sex == "M" ? "male" : "female")}`}
								r={this.scale.radius(+item.total)}
								cx={coords.x}
								cy={coords.y}>							
							</circle>
						);
					})
				}
			</g>
		);
	}

	getCoordinates(item) {
		// todo fix naming and tsv data format to avoid on fly parsing
		const drama = +item.dramaRatio;
		const comedy = +item.comedyRatio;
		const adventure = +item.actionRatio;

		const x = drama * triangle.drama.x + 
					comedy * triangle.comedy.x +
					adventure * triangle.adventure.x;

		const y = drama * triangle.drama.y + 
					comedy * triangle.comedy.y +
					adventure * triangle.adventure.y;
		return {
			x: coeff * this.scale.coords(x),
			y: coeff * this.scale.coords(y)
		};
	}

	setupScales() {
		const totalRange = d3.extent(this.data, (d) => +d.total);
		this.scale.radius
				.domain(totalRange)
				.range([1, 10]);

		const { height } = this.props.size;
		this.scale.coords
				.domain([0, 1])
				.range([0, Math.floor(height / 3 - 50)]);
	}

	updateScales() {
		const { height } = this.props.size;
		this.scale.coords.range([0, Math.floor(height / 3 - 50)]);
	}

};

export default GenresTriangle;