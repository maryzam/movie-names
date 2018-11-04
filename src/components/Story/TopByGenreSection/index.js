import React from 'react';

import styles from './styles.css';

import TopNamesHeatMap from './TopNamesHeatMap';
import GenderModeSwitch from './GenderModeSwitch';

class TopByGenreSection extends React.PureComponent {

	state = {
		currentMode: "All"
	}

	handleModeChange = (event) => {
		const currentMode = event.target.value;
		this.setState({ currentMode });
	}

	render() {

		const { width, height } = this.props;
		const { currentMode } = this.state;

		const descHeight = Math.max(height * 0.2, 150);
		const vizHeight = height - descHeight;

		return (
			<section className="top-by-genre">

				<article className="description">
					<div>
						<h4>Top 10 Names By Genres</h4>
							<GenderModeSwitch 
							currentMode={ currentMode }
							onClick={ this.handleModeChange }
						/>							
					</div>
					<div>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
						Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</div>					
				</article>
				
				<TopNamesHeatMap 
					width={ width }
					height={ vizHeight }
					mode={ currentMode }/>
			</section>
		);
	}

};

export default TopByGenreSection;

