import React from 'react';

import styles from './styles.css';

import TopByDecadeChart from './TopByDecadeChart';

class TopByDecadeSection extends React.PureComponent {

	state = {
		isLoading: true,
		decade: null,
	}

	source = [];
	decadesRange = null;

	componentDidMount() {
		d3.json("data/top_names/by_decades.json")
			.then((source) => {
				this.source = source;
				this.updateDecadesRange();
				this.setState({ isLoading: false });
			});
	}

	render() {

		const { width, height } = this.props;
		const { isLoading, gender, decade } = this.state;

		return (
			<section className="top-by-decades">
				<article>
					<h4>Top Names by Decades</h4>
					<p>How the preferences has been changed in movie industry and real life</p>			
				</article>
				{
					isLoading ? 
						<div className="preloader">Loading...</div> :
						<TopByDecadeSection 
							width={ width } 
							height={height } 
							data={ this.source.find((d) => d.From === decade ) }/>
				}

				<TopByDecadeChart
					width = { width * 0.7 }
					height = { height } />

			</section>
		);
	}

	updateDecadesRange() {
		const range = d3.extent(source, d => d.From);
		this.decadesRange = {
			first: range[0],
			last: range[1]
		};
	}
} 

export default TopByDecadeSection;