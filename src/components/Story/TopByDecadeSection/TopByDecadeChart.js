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
		type: d3.scalePoint(),
		order: d3.scaleBand(),
		opacity: d3.scaleLinear().range([1, 0.5])
	};

	render() {

		const { width, height, data } = this.props;

		this.updateScales();

		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={ width }
					height={ height }>
					{
						data.Stats.map((item) => (
							<g key={`${item.Type}_${item.Order}`}>

							</g>
						))
					}
				</svg>
			</figure>
		);
	}

	updateScales() {
		const { width, height, data } = this.props;

		const types = getDistinct(data, (d) => d.Type);
		this.scales.type.domain(types).range([0, height]);

		const orders = getDistinct(data, (d) => d.Order);
		this.scales.order.domain(orders).range([0, width]);
		this.scales.opacity.domain(d3.extent(orders, d => +d));
	}
}

export default TopByDecadeChart;