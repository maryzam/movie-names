import React from 'react';
import * as d3 from 'd3';

import Gradient from "./Gradient";

const decadeDuration = 10;
const thisYear = 2018;
const maxOrder = 50;

class FrequencyRatioChart extends React.PureComponent {

	state = {
		isLoading: true,
		decade: null,
		highlight: null
	};

	timer = null;

	source = [];
	decades = [];
	scales = {
		ratio: d3.scaleLinear().domain([0, 1]),
		order: d3.scaleBand().padding(0)
	};

	showNextDecade = () => {
		const nextDecade = this.state.decade + decadeDuration;
		if (nextDecade > thisYear) {
			clearInterval(this.timer);
			return;
		} 
		this.setState({ decade: nextDecade });
	};

	showDecade = (event) => {
		const decade = +event.target.dataset.decade;
		this.setState({ decade });
	}

	handleItemOver = (event) => {
		const { order, gender } = event.target.dataset;
		this.setState({ highlight: { order, gender } });
	}

	handleItemOut = (event) => {
		this.setState({ highlight: null });
	}

	componentDidMount() {
		d3.json("data/top_names/frequencies_decades.json")
			.then((source) => {
				const firtsDecade = d3.min(source, (d) => d.Decade);

				const orders = source
					.find(d => d.Decade === firtsDecade).Stats
					.map(d => +d.Order)
					.filter(d => d < maxOrder);

				this.source = source;
				this.decades = source.map(d => d.Decade);
				this.scales.order.domain(orders);

				this.timer = setInterval(this.showNextDecade, 500);
				
				this.setState({ 
					isLoading: false,
					decade: firtsDecade
				});
			});
	}

	componentWillUnmount() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

	render() {

		if (this.state.isLoading) {
			return (<div className="preloader">Loading...</div>);
		}

		const { width, height } = this.props;
		const { decade } = this.state;

		const data = this.source
						.find(d => d.Decade === decade).Stats
						.filter(d => +d.Order  < maxOrder)
						.sort((first, second) => (second.Order - first.Order));

		this.updateScales(width, height);

		const chartHeight =  Math.floor(height / 2) - 20;

		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={ width } 
					height={ height }>
					<def>
						<Gradient name="male-grad" topColor="#05ABC3" bottomColor="#016775" />
						<Gradient name="female-grad" topColor="#9C0047" bottomColor="#E20A6D" />
					</def>
					{ this.renderItems(data, "Male", chartHeight) }
					{ this.renderItems(data, "Female", height - chartHeight) }
					{ this.renderDecades(width / 2, Math.max(50, height * 0.1)) }
					{ this.renderOrderAxis(width / 2, height / 2 + 5)}
					{ this.renderTooltip() }
				</svg>
			</figure>
		);
	}

	renderDecades(x, y) {
		const currentDecade = this.state.decade;
		return (
			<text className="decades" transform={`translate(${x}, ${y})`}>
			{
				this.decades.map(decade => (
					<tspan
						key={decade}
						data-decade={decade}
						className={ (decade === currentDecade) ? "current" : ""}
						onClick={ this.showDecade }>
							{ ` ${decade} ` }
					</tspan>
				))
			}
			</text>
		);
	}

	renderItems(data, gender, baseLine) {
		
		return (
			<g> 
			{
				data.map((item) => {
					const cinematicClass = item[gender].Ratio > 0.49 
											? "cinema" 
											: item[gender].Ratio < 0.1 
											 		? "none" 
											 		: "";
					return (
						<path 
							key={`${gender}_${item.Order}`}
							data-order={ item.Order }
							data-gender={ gender }
							className={`item ${gender.toLowerCase()} ${ cinematicClass }`}
							onMouseOver={ this.handleItemOver }
							onMouseOut={ this.handleItemOut }
							d= { this.generateBarLine(item, gender, baseLine) }/>
						);
					})
			}
			</g>
		);
	}

	renderOrderAxis = (x, y) => {
		return (
			<g className="axis order"
				transform={ `translate(${x}, ${y})` }>
				<text className="middle">
					<tspan className="small">{"<------- more popular ---  "}</tspan>
					<tspan>{ `Top ${ maxOrder } of Real Names` }</tspan>
					<tspan className="small">{ "  --- less popular ------->" }</tspan>
				</text>
			</g>
		);
	}

	renderTooltip() {
		const { highlight, decade } = this.state;
		if (!highlight) { return null; }

		const current = this.source
							.find(d => d.Decade === decade).Stats
							.find(d => d.Order == highlight.order);
		if (!current) { return null; }

		const isMale = highlight.gender === "Male";
		const info = current[highlight.gender];
		const genderCoeff = isMale ? -1 : 1;
		const genderOffset = isMale ? 50 : 10;
		const baseLine = Math.floor(this.props.height / 2);
		const x = this.scales.order(highlight.order) + 0.5 * this.scales.order.bandwidth();
		const y = baseLine + (this.scales.ratio(info.Ratio) + genderOffset ) * genderCoeff;

		return (
			<g className="tooltip"
				transform={ `translate(${x}, ${y})` }>
				<rect 
					x="-2.5em"
					width="5em"
					height="2.5em"
					fill="blue">
				</rect>
				<text dy="1.5em">{ info.Name }</text>
				<text dy="2.5em">{ `(ratio: ${Math.round(info.Ratio * 100)}%)` }</text>
			</g>
		);
	}

	generateBarLine = (item, gender, baseLine) => {

		const genderCoeff = gender === "Male" ? -1 : 1;
		const height = baseLine + this.scales.ratio(item[gender].Ratio) * genderCoeff;
		const width = this.scales.order.bandwidth();
		const left = this.scales.order(item.Order);
		const right = left + width;
		const controlPoint = height + 0.5 * width * genderCoeff;
		return `M ${left} ${baseLine}
				L ${left} ${height}
				C ${left} ${controlPoint} ${right} ${controlPoint} ${right} ${height}
				L ${right} ${baseLine} Z`;
	};

	updateScales(width, height) {
		this.scales.order.range([ 30, width - 30 ]);
		const offset = this.scales.order.bandwidth();
		this.scales.ratio.range([0, height / 2 - offset - 20]);
	}
}

export default FrequencyRatioChart;