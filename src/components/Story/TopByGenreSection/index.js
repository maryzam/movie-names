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

		return (
			<section className="top-by-genre">
				<GenderModeSwitch 
					currentMode={ currentMode }
					onClick={ this.handleModeChange }
				/>
				<TopNamesHeatMap 
					width={ width }
					height={ height }
					mode={ currentMode }/>
			</section>
		);
	}

};

export default TopByGenreSection;

