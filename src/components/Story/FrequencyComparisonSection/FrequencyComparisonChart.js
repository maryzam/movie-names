import React from 'react';
import memoize from "memoize-one";
import * as d3 from 'd3';

const axisOffset = 15;

const generateKey = (info) => `${info.Name}_${info.Sex}_${info.Type}`;

class FrequencyComparisonChart extends React.PureComponent {

	state = {
		isLoading: true,
	}

	source = [];
	scaleFreq = d3.scaleLinear();

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

	componentDidUpdate() {
		if (this.state.isLoading) {
			return;
		}

		const { mode, gender } = this.props;
		const data = this.getCurrentData(mode, gender);
		const simulation = d3.forceSimulation(data)
		      .force("x", d3.forceX((d) => this.scaleFreq(d.Frequency)).strength(1))
		      .force("y", d3.forceY(0))
		      .force("collide", d3.forceCollide(7))
		      .on("tick", () => {
		 			d3.select(this.viz)
		 				.selectAll('.node')
		 				.data(data, function (d) { return !d ?	this.dataset.item : generateKey(d); } )
		 				.attr("transform", (d) => {
		 					const isTop = (d.Type === "Real") || (mode !== "All");
		 					if (isTop && (d.y > -axisOffset)) {
		 						d.y = -axisOffset;
		 					}
		 					if (!isTop && (d.y < axisOffset)) {
		 						d.y = axisOffset;
		 					}
		 					return `translate(${d.x},${d.y})`
		 				});
		      });
	}

	render() {
		if (this.state.isLoading) {
			return (<div className="preloader">Loading...</div>);
		}

		this.updateScales();

		const { width, height } = this.props;
		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={ width }
					height={ height }>

					<g transform={`translate(0, ${ Math.floor(height / 2) })`}>
						{ this.renderAxis() }
						{ this.renderNames() }
					</g>

				</svg>
			</figure>
		);
	}

	renderNames() {

		const { mode, gender } = this.props;
		const data = this.getCurrentData(mode, gender);

		return (
			<g className="nodes">
			{
				data.map((info) => {
					const key = generateKey(info);
					const xPos = this.scaleFreq(info.Frequency);
					return (
						<g 
							key={ key}
							data-item={ key }
							className={ `node ${info.Type} ${info.Sex == "M" ? "male" : "female" }`}
							transform={ `translate(${xPos},0)`}
						>
							<text>▼</text>
						</g>
					); 
				})
			}
			</g>
		);
	}

	renderAxis() {
		const size = this.scaleFreq.range();
		const ticks = this.scaleFreq.ticks(5);
		return (
			<g className="axis">
				<line x1={ 0 } x2={ size[1] } y1={-3} y2={-3}/>
				{
					ticks.map((tick) => (
						<g key={tick}
							className="tick"
							transform={`translate(${this.scaleFreq(tick)}, 0)`}>
							<rect width={ 30 } height={ 10 } x={ -15 } y={ -5 } />
							<text >{tick}%</text>
						</g>
					))
				}
			</g>
		);
	}

	updateScales() {
		const { mode, gender, width } = this.props;

		const data = this.getCurrentData(mode, gender);
		const freqRange = d3.extent(data, d => d.Frequency);
		const offset = width * 0.1;

		this.scaleFreq
				.domain(freqRange)
				.range([offset, (width - offset)])
				.nice();
	}

	getCurrentData = memoize((mode, gender) => {
		const result = [];
		this.source.forEach((item) => {
			if (mode !== "Real") {
				const cinemaInfo = item.Cinema[gender];
				result.push({ Type: "Cinema", ...cinemaInfo});
			}
			if (mode !== "Cinema") {
				const realInfo = item.Real[gender];
				result.push({ Type: "Real", ...realInfo});
			}
		});
		return result;
	});
}

export default FrequencyComparisonChart;