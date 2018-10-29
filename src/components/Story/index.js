import React from 'react';
import { throttle } from 'lodash';

import styles from './story.css';

import TopByGenreSection from './TopByGenreSection';

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

		return (
			<main className="story">
				<TopByGenreSection 
					width = {this.state.viewport.width }
					height = {this.state.viewport.height }/>
			</main>
		);
	}

}

export default Story;