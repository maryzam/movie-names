import React from 'react';
import * as d3 from 'd3';

class FrequencyComparisonChart extends React.PureComponent {

	state = {
		isLoading: true,
	}

	data = [];
	scaleFreq = d3.scaleLinear();

	componentDidMount() {
		d3.json("data/top_names/top_comparison_100.json")	
			.then((source) => {
				console.log(source);
				this.data = source;
				this.setState({ isLoading: false });
			})
			.catch((err) => {
				console.error(err);
			});
	}

	render() {

		if (this.state.isLoading) {
			return (<div className="preloader">Loading...</div>);
		}

		const { width, height } = this.props;

		return (
			<figure className="viz">
				<svg ref={ viz => (this.viz = viz) }
					width={ width }
					height={ height }>
						
				</svg>
			</figure>
		);

	}

	renderNames() {

	}

	renderAxis() {

	}
}

export default FrequencyComparisonChart;