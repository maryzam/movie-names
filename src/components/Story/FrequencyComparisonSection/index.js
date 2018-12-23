import React from 'react';

import styles from './styles.css';

import { GENDER } from "./constants";
import FrequencyComparisonChart from "./FrequencyComparisonChart";

class FrequencyComparisonSection extends React.PureComponent {

	state = {
		gender: GENDER.ALL
	}

	componentDidUpdate(prevProps, prevState) {
		const { height } = this.props;
		const offset = 0.3;
		const range = {
			min: -height * offset,
			max: height * (1 - offset)
		};

		const allArticles = this.node.getElementsByClassName("description");
		for (let i = 0; i < allArticles.length; i++) {
			const article = allArticles[i];
			const { top } = article.getBoundingClientRect();
			if ((top > range.min) && (top < range.max)) {
				const gender = article.dataset.gender;
				if (prevState.gender !== gender) {
					this.setState({ gender });
				}
				return;
			}
		}
	}

	render() {
		const { width, height, scroll } = this.props;
		return (
			<section 
				ref={ node => (this.node = node) } 
				className="frequency-comparison">

				<article className="viz">
					<h4>Are the top names really popular?</h4>
					<FrequencyComparisonChart 
						width={ width } 
						height={ height * 0.8 }
						scroll={ scroll }
						gender={ this.state.gender } />
				</article>

				<article className="description" data-gender={ GENDER.ALL }>
					<div className="content">
						<p>
							To define the most common names it's not enought to just sort the names by the number of people named by them. We also need to check how often these names used compared to their closest neighbors from the ordered list.
						</p>
						<p>
							The frequency distribution chart makes obvious that in <span className="real">real life</span> top 6 names use much more often rather than all other. <strong>Every 19th baby in the US borned since 1960 was called <span className="male">Michael</span>, <span className="male">David</span>, <span className="male">James</span>, <span className="male">John</span> or <span className="male">Christopher</span></strong>.
						</p>
						<p>
							At the same time <span className="cinema">character names</span> have lower bias of occurance among the 100 most common of them. Only person called <span className="male">John</span> occurres on our screen in 1% of movies and tv series.
							All other <span className="cinema">cinema names</span> are much less common and there isn't such a large gap between them.
						</p>
					</div>
				</article>
				
				<article className="description" data-gender={ GENDER.MALE }>
					<div className="content">
						<p>Male</p>
					</div>
				</article>

				<article className="description" data-gender={ GENDER.FEMALE }>
					<div className="content">
						<p>Female</p>
					</div>
				</article>

			</section>
		);
	}
}

export default FrequencyComparisonSection;