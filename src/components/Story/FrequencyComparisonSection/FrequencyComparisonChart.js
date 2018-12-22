import React from 'react';
import memoize from "memoize-one";
import * as d3 from 'd3';

import { GENDER } from "./constants";

const axisOffset = 15;

const generateKey = (info) => `${info.Name}_${info.Sex}_${info.Type}`;

class FrequencyComparisonChart extends React.PureComponent {

	state = {
		isLoading: true,
		gender: GENDER.ALL,
		dontResetSimulation: false
	};

	source = [];
	scaleFreq = d3.scaleLinear();

	isInvisible = () => {
		const { height, scroll } = this.props;
		const { top, bottom } = this.viz.getBoundingClientRect();
		const middle = height / 2;
		return ( top > middle) || ( bottom < middle);
	}

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
		const  { dontResetSimulation, isLoading } = this.state;
		if (isLoading || dontResetSimulation) {
			return;
		}

		if (this.isInvisible()) {
			return;
		}

		const { gender } = this.props;
		const data = this.getCurrentData(gender);
		const simulation = d3.forceSimulation(data)
		      .force("x", d3.forceX((d) => this.scaleFreq(d.Frequency)).strength(1))
		      .force("y", d3.forceY(0))
		      .force("collide", d3.forceCollide(7))
		      .on("tick", () => {
		 			d3.select(this.viz)
		 				.selectAll('.node')
		 				.data(data, function (d) { return !d ?	this.dataset.item : generateKey(d); } )
		 				.attr("transform", (d) => {
		 					const isTop = (d.Type === "Real");
		 					if (isTop && (d.y > -axisOffset)) {
		 						d.y = -axisOffset;
		 					} else if (!isTop && (d.y < axisOffset)) {
		 						d.y = axisOffset;
		 					}
		 					return `translate(${d.x},${d.y})`
		 				});
		      });

		this.setState({ dontResetSimulation: true });
	}

	render() {
		if (this.state.isLoading) {
			return (<div className="preloader">Loading...</div>);
		}

		this.updateScales();

		const { width, height, scroll } = this.props;
		
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

		const { gender } = this.props;
		const data = this.getCurrentData(gender);

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
		const { gender, width } = this.props;

		const data = this.getCurrentData(gender);
		const freqRange = d3.extent(data, d => d.Frequency);
		const offset = width * 0.05;

		this.scaleFreq
				.domain(freqRange)
				.range([offset, width-offset])
				.nice();
	}

	getCurrentData = memoize((gender) => {
		const result = [];
		this.source.forEach((item) => {
			const cinemaInfo = item.Cinema[gender];
			const realInfo = item.Real[gender];
			result.push({ Type: "Cinema", ...cinemaInfo});
			result.push({ Type: "Real", ...realInfo});
		});
		return result;
	});
}

export default FrequencyComparisonChart;