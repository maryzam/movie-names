import React from 'react';
import * as d3 from 'd3';

class FrequencyRatioChart extends React.PureComponent {

	state = {
		isLoading: true,
		gender: 'All'
	}

	data = [];
	scales = {
		ratio: d3.scaleLinear().domain([0, 1]),
		order: d3.scaleBand().padding(0)
	};

	componentDidMount() {
		d3.json("data/top_names/frequencies.json")
			.then((source) => {
				this.data = source;
				const orders = source.map(d => d.Order);
				this.scales.order.domain(orders.sort());
				this.setState({ isLoading: false });
			});
	}

	render() {

		if (this.state.isLoading) {
			return (<div className="preloader">Loading...</div>);
		}

		const { width, height } = this.props;
		const { gender } = this.state;

		this.updateScales(width, height);

		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={ width } 
					height={ height }>
				{
					this.data.map((item) => {
						const itemHeight = this.scales.ratio(item[gender].Ratio);
						const isCinematic = item[gender].Ratio > 0.51;
						return (
							<rect key={`{${item.Order}`}
								className={`item ${isCinematic ? "cinema" : ""}`}
								rx="3" ry="3"
								x={ this.scales.order(item.Order) }
								y={ itemHeight }
								width={ this.scales.order.bandwidth() }
								height={ height - itemHeight }/>
						)
					})
				}

				<line className="middle-line" 
					x1={0} y1={ height / 2}
					x2={ width } y2={ height / 2}
				/>
				</svg>
			</figure>
		);
	}

	updateScales(width, height) {
		this.scales.ratio.range([ height, 0 ]);
		this.scales.order.range([ 0, width ]);
	}
}

export default FrequencyRatioChart;