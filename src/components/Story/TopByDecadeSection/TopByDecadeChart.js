import React, { Fragment } from 'react';
import * as d3 from 'd3';

const slopeFactor = 0.1;
const genders = ["Male", "Female"];

const getDistinct = (data, action) => {
	if (!data || data.length < 1) {
		return [];
	}
	const result = {};
	data.forEach((item) => {
		const current = action(item);
		result[current] = current;
	});
	return Object.keys(result);
};

const calculateLinks = (data) => {
	const links = [];
	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		if (item.Type === "Cinema") {
			continue;
		}
		genders.forEach(gender => {
			if (item[gender].IsAbsoluteTop) {
				links.push({
					from: item.Order,
					till: data.find((d) => (d.Type === "Cinema") && (d[gender].Name == item[gender].Name)).Order,
					gender: gender.toLowerCase()
				});
			}
		});
	}
	links.forEach((link) => {
		link["isDouble"] = links.some(other => 
			(other.from == link.from) &&
			(other.till === link.till) &&
			(other.gender !== link.gender)
		);		
	})
	return links;
};

class TopByDecadeChart extends React.PureComponent {

	scales = {
		type: d3.scaleBand().paddingInner(0.5).paddingOuter(0.1),
		order: d3.scaleBand().padding(0.3),
		gender: d3.scaleBand().domain(genders)
	};

	render() {

		const { width, height, data } = this.props;

		this.updateScales();

		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={ width }
					height={ height }>
					{ this.renderItems(data) }
					{ this.renderLinks(data) }
					{ this.renderAxis() }
				</svg>
			</figure>
		);
	}

	renderAxis() {
		const topOffset = 15;
		const cinemaX = this.scales.type("Cinema") + this.scales.type.bandwidth() + 5;
		const realX = this.scales.type("Real") - 5;
		return (
			<g className="axis">
				<text
					 className="real"
					 transform={ `translate(${realX},${topOffset})rotate(270)`}>
					 { "<-------------------------- Real Life ---" }
				</text>
				<text 
					className="cinema"
					transform={ `translate(${ cinemaX },${topOffset})rotate(90)` }>
					{ "--- Movies & TV Series ---------------->" }
				</text>
			</g>			
		);
	}

	renderItems(data) {

		const borderLines = this.generateBorders(); 
		
		return (
			<g className="items">
			{ this.renderItemsForGender("Male", data, borderLines) }
			{ this.renderItemsForGender("Female", data, borderLines) }
			
			</g>
		);
	}

	renderItemsForGender(gender, data, borderLines) {

		const currentClassName = gender.toLowerCase();

		const center = {
			x: this.scales.gender.bandwidth() / 2,
			y: this.scales.order.bandwidth() / 2 + 5
		};

		const genderOffset = this.scales.gender(gender);

		return data.Stats.map((item) => {

					const y = this.scales.order(item.Order);
					const x = this.scales.type(item.Type) + genderOffset;

					return (
						<g className="item"
							key={`${item.Type}_${gender}_${item[gender].Name}`}
							transform={`translate(${x},${y})`}>
							<path 
								className={ currentClassName }
								d={ borderLines[gender] } 
								style={{ opacity: item[gender].IsAbsoluteTop ? 1 : 0.6 }} />
							<text transform={ `translate(${center.x}, ${center.y})` }>
									{ item[gender].Name }
							</text>
						</g>
					);
				});
	}

	renderLinks(data) {
		
		const links = calculateLinks(data.Stats);

		const labelWidth = this.scales.type.bandwidth();
		const fromX = this.scales.type("Real") + labelWidth + 5;
		const tillX = this.scales.type("Cinema") - 5;
		const offset = this.scales.order.bandwidth() / 2;

		return (
			<g className="links">
				{ 
					links.map((link) => {
						const yOffset = offset + (link.isDouble && (link.gender === "male") ? 0 : 4);
						return (
							<line 
								key={ `${ link.from }_${ link.till}_${ link.gender }`}
								className={ `link ${ link.gender }`}
								x1={ fromX }
								y1={ this.scales.order(link.from) + yOffset }
								x2={ tillX }
								y2= { this.scales.order(link.till) + yOffset }
							/>
						)
					})
				}
			</g>
		);
	}

	updateScales() {
		const { width, height, data } = this.props;

		const types = getDistinct(data.Stats, (d) => d.Type);
		this.scales.type.domain(types).range([0, width]);

		const orders = getDistinct(data.Stats, (d) => d.Order);
		this.scales.order.domain(orders).range([0, height]);
		this.scales.gender.range([0, this.scales.type.bandwidth()]);
	}

	generateBorders() {
		const width = this.scales.gender.bandwidth();
		const height = this.scales.order.bandwidth();

		const cTop = width * (1 + slopeFactor);
		const cBottom = width * ( 1 - slopeFactor);
		const xSlopeOffset = width * slopeFactor;

		return {
			Male: `M 0 0 L 0 ${ height } L ${ cBottom } ${ height } L ${ cTop } 0 Z`,
			Female: `M ${ xSlopeOffset } 0 L ${ -xSlopeOffset } ${ height } L ${ width } ${ height } L ${ width } 0 Z`
		}
	}
}

export default TopByDecadeChart;