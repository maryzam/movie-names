import React from 'react';
import memoize from "memoize-one";
import * as d3 from 'd3';

import { GENDER } from "./constants";

const allGenders = Object.values(GENDER);
const axisOffset = 15;

const generateKey = (info) => `${info.Type}_${info.Order}`;

class FrequencyComparisonChart extends React.PureComponent {

	state = {
		isLoading: true
	};

	data = [];
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
				this.data = this.flattenData(source);
				this.setState({ isLoading: false });
			})
			.catch((err) => {
				console.error(err);
			});
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.isLoading ||	this.isInvisible()) {
			return;
		}

		const  { gender } = this.props;
		if (prevProps.gender == gender) {
			return;
		}

		const simulation = d3.forceSimulation(this.data)
		      .force("x", d3.forceX((d) => this.scaleFreq(d[gender].Frequency)).strength(1))
		      .force("y", d3.forceY(0))
		      .force("collide", d3.forceCollide(7))
		      .on("tick", () => {
		 			d3.select(this.viz)
		 				.selectAll('.node')
		 				.data(this.data, function (d) { return !d ?	this.dataset.item : generateKey(d); } )
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
	}

	render() {
		if (this.state.isLoading) {
			return (<div className="preloader">Loading...</div>);
		}

		this.updateScales();

		const { width, height, scroll } = this.props;

		return (
				<figure>
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
		return (
			<g className="nodes">
			{
				this.data.map((item) => {
					const key = generateKey(item);
					const info = item[gender];
					const xPos = item.x || this.scaleFreq(info.Frequency);
					const yPos = item.y || 0;
					return (
						<g 
							key={ key}
							data-item={ key }
							className={ `node ${item.Type} ${info.Sex == "M" ? "male" : "female" }`}
							transform={ `translate(${xPos},${yPos})`}
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
		const { width, gender, scroll } = this.props;
		const freqMin = d3.min(this.data, d => d3.min(allGenders, g => d[g].Frequency));
		const freqMax = d3.max(this.data, d => d3.max(allGenders, g => d[g].Frequency));
		const offset = width * 0.05;

		this.scaleFreq
				.domain([freqMin, freqMax])
				.range([offset, width-offset])
				.nice();
	}

	flattenData(source) {
		const result = [];
		source.forEach((item, order) => {
			const cinemaInfo = item.Cinema;
			const realInfo = item.Real;
			result.push({ Type: "Cinema", "Order": order, ...cinemaInfo});
			result.push({ Type: "Real", "Order": order, ...realInfo});
		});
		return result;
	}
}

export default FrequencyComparisonChart;