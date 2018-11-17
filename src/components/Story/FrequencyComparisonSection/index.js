import React from 'react';

import styles from './styles.css';

import FrequencyComparisonChart from "./FrequencyComparisonChart";

const MODE = {
	ALL: "All",
	CINEMA: "Cinema",
	REAL: "Real"
};

const GENDER = {
	ALL: "All",
	MALE: "Male",
	FEMALE: "Female"
};

class FrequencyComparisonSection extends React.PureComponent {

	state = {
		currentGender: GENDER.ALL,
		currentMode: MODE.ALL
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
					<p></p>

				</article>

			</section>
		);
	}
}

export default FrequencyComparisonSection;