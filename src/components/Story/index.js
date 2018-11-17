import React from 'react';
import { throttle } from 'lodash';

import styles from './story.css';

import TopByGenreSection from './TopByGenreSection';
import GenresTriangleSection from './GenresTriangleSection';
import CinemaVsRealSection from './CinemaVsRealSection';
import FrequencyComparisonSection from './FrequencyComparisonSection';

class Story extends React.Component {

	state = {
		viewport: {
			width: 0,
			height: 0
		},
		page: {
			x: 0,
			y: 0
		}
	};

	onScroll = (event) => {
		const top = event.pageY || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
		const left = event.pageX || window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
		this.setState({
			page: {
				x: Math.round(left),
				y: Math.round(top)
			}
		});
	}

	onResize = (event) => {
		const width = document.documentElement.clientWidth;
		const height = document.documentElement.clientHeight;
		this.setState({
			viewport: { width, height }
		});
	}

	onScrollHandler = throttle(this.onScroll, 100);
	onResizeHandler = throttle(this.onResize, 100);

	componentDidMount() {
		window.addEventListener('scroll', this.onScrollHandler);
		window.addEventListener('resize', this.onResizeHandler);
		this.onResize();
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScrollHandler);
		window.removeEventListener('resize', this.onResizeHandler);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (nextState.viewport.width !== this.state.viewport.width) ||
				(nextState.viewport.height !== this.state.viewport.height) ||
				(nextState.page.x !== this.state.page.x) ||
				(nextState.page.y !== this.state.page.y);
	}

	render() {

		const { width, height } = this.state.viewport;

		return (
			<main className="story">
				<FrequencyComparisonSection 
					width = { width }
					height = { height }/>
				<CinemaVsRealSection 
					width = { width }
					height = { height }/>
				<GenresTriangleSection 
					width = { width }
					height = { height }/>
				<TopByGenreSection 
					width = { width }
					height = { height }/>
			</main>
		);
	}

}

export default Story;