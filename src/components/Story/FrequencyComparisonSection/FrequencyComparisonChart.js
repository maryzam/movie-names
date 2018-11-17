import React from 'react';
import * as d3 from 'd3';

const SYMBOLS = {
	Real: "⬤",
	Cinema: "★"
}

class FrequencyComparisonChart extends React.PureComponent {

	state = {
		isLoading: true,
	}

	source = [];

	scaleFreq = d3.scaleLinear();
	
	forceSimulation = d3.forceSimulation()
					      .force("x", d3.forceX((d) => this.scaleFreq(d.Frequency)).strength(1))
					      .force("y", d3.forceY(0))
					      .force("collide", d3.forceCollide(5))
					      .stop();

	componentDidMount() {
		d3.json("data/top_names/top_comparison_100.json")	
			.then((source) => {
				this.source = source;
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

		const { width, height, mode, gender } = this.props;

		const data = this.getCurrentData(mode, gender);

		this.updateScale(data, width);

		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={ width }
					height={ height }>

					<g className="axis">
						{ this.renderAxis() }
					</g>

					<g className="nodes" transform={`translate(0, ${ Math.floor(height / 2) })`}>
						{  this.renderNames(data) }
					</g>

				</svg>
			</figure>
		);

	}

	renderNames(data) {
		return data.map((info) => {
			const key = `${info.Name}_${info.Sex}_${info.type}`;
			return (
				<text 
					key={ key}
					data-item={ key }
					className={ `node ${info.type} ${info.Sex == "M" ? "male" : "female" }`}
					transform={ `translate(${this.scaleFreq(info.Frequency)},0)`}
				>{ SYMBOLS[info.type] }</text>
			);
		});
	}

	renderAxis(data) {

	}

	getCurrentData(mode, gender) {
		const result = [];
		this.source.map((item) => {
			if (mode !== "Real") {
				const cinemaInfo = item.Cinema[gender];
				result.push({ type: "Cinema", ...cinemaInfo});
			}
			if (mode !== "Cinema") {
				const realInfo = item.Real[gender];
				result.push({ type: "Real", ...realInfo});
			}
		});
		return result;
	}

	updateScale(data, width) {
		const freqRange = d3.extent(data, d => d.Frequency);
		this.scaleFreq
				.domain(freqRange)
				.range([0, width])
				.nice();
	}

}

export default FrequencyComparisonChart;