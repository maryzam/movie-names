import React from 'react';
import * as d3 from 'd3';

const decadeDuration = 10;
const thisYear = 2018;
const maxOrder = 50;

class FrequencyRatioChart extends React.PureComponent {

	state = {
		isLoading: true,
		decade: null,
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
					{ this.renderItems(data, "Male", chartHeight) }
					{ this.renderItems(data, "Female", height - chartHeight) }
					{ this.renderDecades(width / 2, Math.max(50, height * 0.1)) }
					{ this.generateOrderAxis(width / 2, height / 2 + 5)}
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
					const isCinematic = item[gender].Ratio > 0.51;
					const isNonCinematic = item[gender].Ratio < 0.01;
					return (
						<path 
							key={`${gender}_${item.Order}`}
							className={`item ${isCinematic ? "cinema" : ""} ${isNonCinematic ? "none" : ""}`}
							d= { this.generateBarLine(item, gender, baseLine) } />
						);
					})
			}
			</g>
		);
	}

	generateOrderAxis = (x, y) => {
		return (
			<g className="axis order"
				transform={ `translate(${x}, ${y})` }>
				<text className="middle">
					<tspan className="small">{"<------- less popular ---  "}</tspan>
					<tspan>{ `Top ${ maxOrder } of Real Names` }</tspan>
					<tspan className="small">{ "  --- more popular ------->" }</tspan>
				</text>
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
		this.scales.order.range([ width - 20, 20 ]);
		const offset = this.scales.order.bandwidth();
		this.scales.ratio.range([0, height / 2 - offset - 20]);
	}
}

export default FrequencyRatioChart;