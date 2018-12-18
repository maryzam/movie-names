import React from 'react';
import { throttle } from 'lodash';

import styles from './story.css';

import TopByDecadeSection from './TopByDecadeSection';
import TopByGenreSection from './TopByGenreSection';
import GenresTriangleSection from './GenresTriangleSection';
import CinemaVsRealSection from './CinemaVsRealSection';
import FrequencyComparisonSection from './FrequencyComparisonSection';

import Conclusion from './Conclusion';

class Story extends React.Component {

	state = {
		viewport: {
			width: 0,
			height: 0
		},
		scroll: 0
	};

	onScroll = (event) => {
		const top = event.pageY || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
		this.setState({ scroll: Math.round(top) });
	}

	onResize = (event) => {
		const size = this.container.getBoundingClientRect();
		const width = Math.floor(size.width);
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
				(nextState.scroll !== this.state.scroll);
	}

	render() {

		const { width, height } = this.state.viewport;

		return (
			<main className="story" ref={ container => { this.container = container }}>
				<CinemaVsRealSection 
					width = { width }
					height = { height } 
					scroll= { this.state.scroll }/>
				<TopByDecadeSection 
					width = { width }
					height = { height }/>
				<FrequencyComparisonSection 
					width = { width }
					height = { height }/>
				<GenresTriangleSection 
					width = { width }
					height = { height }/>
				<TopByGenreSection 
					width = { width }
					height = { height }/>
				<Conclusion />
			</main>
		);
	}

}

export default Story;