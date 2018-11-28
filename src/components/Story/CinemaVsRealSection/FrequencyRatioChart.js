import React from 'react';
import * as d3 from 'd3';

class FrequencyRatioChart extends React.PureComponent {

	state = {
		isLoading: true,
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

		this.updateScales(width, height);

		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={ width } 
					height={ height }>
				
					{ this.renderItems("Male", height / 2) }
						{ this.renderItems("Female", height / 2) }

				</svg>
			</figure>
		);
	}

	renderItems(gender, chartHeight) {
		return (
			<g> 
			{
				this.data.map((item) => {
					
					const itemHeight = this.scales.ratio(item[gender].Ratio);
					const isCinematic = item[gender].Ratio > 0.51;
					const level = this.scales.ratio(item[gender].Ratio);

					return (
						<rect key={`${gender}_${item.Order}`}
							className={`item ${isCinematic ? "cinema" : ""}`}
							rx="3" ry="3"
							x={ this.scales.order(item.Order) }
							y={ (gender == "Female") ? chartHeight : level }
							width={ this.scales.order.bandwidth() }
							height={ chartHeight - level }/>
						);
					})
			}
			</g>
		);
	}

	updateScales(width, height) {
		this.scales.ratio.range([ height / 2, 0 ]);
		this.scales.order.range([ 0, width ]);
	}
}

export default FrequencyRatioChart;