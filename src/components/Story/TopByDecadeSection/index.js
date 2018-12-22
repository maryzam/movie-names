import React from 'react';
import * as d3 from 'd3';

import styles from './styles.css';

import TopByDecadeChart from './TopByDecadeChart';
import DecadeSwitch from "./DecadeSwitch";

class TopByDecadeSection extends React.PureComponent {

	state = {
		isLoading: true,
		decade: null,
	}

	source = null;
	decades = null;

	componentDidMount() {
		d3.json("data/top_names/by_decades.json")
			.then((source) => {
				this.source = source;
				this.updateDecades();
				this.setState({ 
					isLoading: false,
					decade: this.decades.range.first
				});
			});
	}

	render() {

		const { width, height } = this.props;
		const { isLoading, decade } = this.state;

		return (
			<section className="top-by-decades">
				<article>
					<h4>Top Names by Decades</h4>
					<p>Same conclusion can be confirmed by comparing top names from daily life with most common names from cinema.</p>
					<p>These two lists almost do not overlap. However, favorites do not change a lot from one decade to another for both of them.</p>
					<p>Does it mean that films follow the same trends with just different preferences? Let's find out it!</p>			
				</article>
				{
					isLoading ? 
						<div className="preloader">Loading...</div> :
						<article className="fixed">
							<DecadeSwitch 
								decade={ decade }
								isFirst={ decade == this.decades.range.first }
								isLast={ decade == this.decades.range.last } 
								onSwitch={ this.onDecadeSwitch }/>
							<TopByDecadeChart
								width={ width * 0.7 } 
								height={ height * 0.7 } 
								data={ this.source.find((d) => d.Decade === decade ) }/>
						</article>
				}
			</section>
		);
	}

	onDecadeSwitch = (event) => {

		const direction = event.target.value;
		const current = this.state.decade;
		const currentPos = this.decades.all.findIndex(d => d === current)

		if (direction == "next") {
			const next = currentPos + 1;
			if (next >= this.decades.all.length) { return; }
			this.setState({ decade: this.decades.all[next] });
		} 

		if (direction == "prev") {
			const prev = currentPos - 1;
			if (prev < 0) { return; }
			this.setState({ decade: this.decades.all[prev] });
		}
	}

	updateDecades() {
		const decades = this.source.map(d => d.Decade);
		decades.sort((a, b) => (a - b));
		this.decades = {
			all: decades,
			range: {
				first: decades[0],
				last: decades[(decades.length - 1)]
			}
		};
	}
} 

export default TopByDecadeSection;