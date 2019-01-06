import React from 'react';
import memoize from "memoize-one";
import * as d3 from 'd3';

import { GENDER } from "./constants";

import forceBoundary from "../../../utils/forceBoundary"

const allGenders = Object.values(GENDER);
const axisOffset = 15;
const cellSize = 10;

const generateKey = (info) => `${info.Type}_${info.Order}`;
const ensureGender = (gender) => gender || GENDER.ALL;

class FrequencyComparisonChart extends React.PureComponent {

	state = {
		isLoading: true
	};

	data = [];
	scaleFreq = d3.scaleLinear();

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
		if (this.state.isLoading) {
			return;
		}
		const { width, height, gender } = this.props;
		if ((gender === null) || (prevProps.gender === gender)) {
			return;
		}

		const currentGender = ensureGender(gender);
		const prevGender = ensureGender(prevProps.gender);

		d3.select(this.viz)
		 	.selectAll('.node')
		 	.data(this.data, function (d) { return !d ?	this.dataset.item : generateKey(d); } )
		 		.attr("transform", (d) => `translate(${d[prevGender].pos.x},${d[prevGender].pos.y})`)
		 	.transition()
		 		.attr("transform", (d) => `translate(${d[currentGender].pos.x},${d[currentGender].pos.y})`);
	}

	render() {
		if (this.state.isLoading) {
			return (<div className="preloader">Loading...</div>);
		}

		this.updateScales();
		this.updateGridPositions();

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
		const gender = ensureGender(this.props.gender);
		return (
			<g className="nodes">
			{
				this.data.map((item) => {
					const key = generateKey(item);
					const info = item[gender];

					return (
						<g 
							key={ key}
							data-item={ key }
							className={ `node ${item.Type} ${info.Sex == "M" ? "male" : "female" }`}
						>
							<circle r="3"></circle>
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
		const { width, scroll } = this.props;

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

	updateGridPositions() {
		const gridColumns = {};
		const maxPerColumn = Math.floor(((this.props.height / 2) - axisOffset) / cellSize) - 1;
		console.log(maxPerColumn);

		this.data.map((item) => {
			const sign = (item.Type === "Real") ? -1 : 1;
			gridColumns[item.Type] = gridColumns[item.Type] || {};

			allGenders.forEach((gender) => {
				const accurateX = this.scaleFreq(item[gender].Frequency);
				let gridX = Math.round(accurateX / cellSize);

				gridColumns[item.Type][gender] = gridColumns[item.Type][gender] || {};
				const currentColumn = gridColumns[item.Type][gender];
				currentColumn[gridX] = currentColumn[gridX] || 0;

				while (currentColumn[gridX] > maxPerColumn) {
					gridX++;
					currentColumn[gridX] = currentColumn[gridX] || 0;
				}

				const height = currentColumn[gridX] * cellSize + axisOffset;

				item[gender]["pos"] = {
					x: gridX * cellSize, 
					y: sign * height,
					accX: accurateX
				};

				currentColumn[gridX]++;
			})
		});
	}
}

export default FrequencyComparisonChart;