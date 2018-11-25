import React from 'react';
import * as d3 from 'd3';

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
}

class TopByDecadeChart extends React.PureComponent {

	scales = {
		type: d3.scaleBand().padding(0.5),
		order: d3.scaleBand().padding(0.3),
		gender: d3.scalePoint().domain(["Male", "Female"]).padding(0.5)
	};

	render() {

		const { width, height, data } = this.props;

		this.updateScales();

		const borderLines = this.generateBorders(); 
		const labelOffset = this.scales.order.bandwidth() / 2 + 5;
		const labelMale = this.scales.gender("Male");
		const labelFemale = this.scales.gender("Female");

		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={ width }
					height={ height }>
					{
						data.Stats.map((item) => {
							const y = this.scales.order(item.Order);
							const x = this.scales.type(item.Type);

							return (
								<g 
									className="item"
									key={`${item.Type}_${item.Order}`}
									transform={`translate(${x},${y})`}>
									<path 
										className="male"
										d={ borderLines.male } />
									<text transform={ `translate(${labelMale}, ${labelOffset})` }>
										{ item.Male.Name }
									</text>
									<path 
										className="female"
										d={ borderLines.female } />
									<text transform={ `translate(${labelFemale}, ${labelOffset})` }>
										{ item.Female.Name }
									</text>									
								</g>
							)}
						)
					}
				</svg>
			</figure>
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
		const width = this.scales.type.bandwidth();
		const height = this.scales.order.bandwidth();

		const slopeFactor = 0.55;
		const cTop = width * slopeFactor;
		const cBottom = width * ( 1 - slopeFactor);
		
		const malePath = `M 0 0 L 0 ${ height } L ${ cBottom } ${ height } L ${ cTop } 0 Z`;
		const femalePath = `M ${ cTop } 0 L ${ cBottom } ${ height } L ${ width } ${ height } L ${ width } 0 Z`;

		return { male: malePath, female: femalePath };
	}
}

export default TopByDecadeChart;