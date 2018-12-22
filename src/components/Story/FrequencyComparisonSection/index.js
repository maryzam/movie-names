import React from 'react';

import styles from './styles.css';

import FrequencyComparisonChart from "./FrequencyComparisonChart";
import GenderSwitch from "./GenderSwitch";

import { GENDER } from "./constants";

class FrequencyComparisonSection extends React.PureComponent {

	state = {
		currentGender: GENDER.ALL,
		showSwitch: false
	}

	handleGenderChanged = (event) => {
		const currentGender = event.target.value;
		this.setState({ currentGender });
	}

	render() {

		const { width, height, scroll } = this.props;
		const { currentGender, showSwitch } = this.state;

		return (
			<section className="frequency-comparison">

				<FrequencyComparisonChart 
					width={ width } 
					height={ height }
					scroll= { scroll }
					gender={ currentGender }/>

				<article className="description">
					
					<h4>Frequency Distribution of the most popular names</h4>
					{ 
						showSwitch 
							? <GenderSwitch 
								currentGender={ currentGender } 
								onChange={ this.handleGenderChanged } /> 
							: null
					}

				</article>
				<article className="description">
					123
				</article>
				<article className="description">
					456
				</article>

			</section>
		);
	}
}

export default FrequencyComparisonSection;