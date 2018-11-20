import React from 'react';

import styles from './styles.css';

import FrequencyComparisonChart from "./FrequencyComparisonChart";
import ModeSwitch from "./ModeSwitch";
import GenderSwitch from "./GenderSwitch";

import { MODE, GENDER } from "./constants";

class FrequencyComparisonSection extends React.PureComponent {

	state = {
		currentGender: GENDER.ALL,
		currentMode: MODE.ALL
	}

	handleModeChanged = (event) => {
		const currentMode = event.target.value;
		this.setState({ currentMode });
	}

	handleGenderChanged = (event) => {
		const currentGender = event.target.value;
		this.setState({ currentGender });
	}

	render() {

		const { width, height } = this.props;
		const { currentMode, currentGender } = this.state;

		return (
			<section className="frequency-comparison">

				<FrequencyComparisonChart 
					width={ width * 0.7 } 
					height={ height }
					mode={ currentMode }
					gender={ currentGender }/>

				<article className="description">
					
					<h4>Frequency Distribution of the most popular names</h4>
					<ModeSwitch 
						currentMode={ currentMode } 
						onChange={ this.handleModeChanged} />
					<GenderSwitch currentGender={ currentGender } onChange={ this.handleGenderChanged } />

				</article>

			</section>
		);
	}
}

export default FrequencyComparisonSection;