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
							To define the most common names it's not enough to just sort the names by the number of people named by them. We also need to check how often these names are used compared to their closest neighbors from the ordered list.
						</p>
						<p>
							The frequency distribution chart makes obvious that in <span className="real">real life</span> top 6 names are used much more often rather than all the others. <strong>Every 19th baby in the US born since 1960 was called <span className="male">Michael</span>, <span className="male">David</span>, <span className="male">James</span>, <span className="male">John</span> or <span className="male">Christopher</span></strong>.
						</p>
						<p>
							At the same time <span className="cinema">character names</span> have lower bias of occurence among the 100 most common of them. Only person called <span className="male">John</span> occures on our screen in 1% of movies and tv series.
							All other <span className="cinema">cinema names</span> are much less common and there isn't such a large gap between them.
						</p>
					</div>
				</article>
				
				<article className="description" data-gender={ GENDER.MALE }>
					<div className="content">
						<p>Interesting that people are less creative when choosing names for boys (marked ▼ on chart).</p>
						<p>Occurence comparison among only <span className="male">male names</span> tells us that one of the 10 most common of them is used by over than 17% of men in the United States. Seems, that it's not so hard to guess a name of your new friend or colleague, is it?</p>
						<p>On the other hand, the writers strive to diversify the names of the heroes of their scenarios. All the names except Jonh have frequency coefficient around 1.2% in the cinema world.</p>
					</div>
				</article>

				<article className="description" data-gender={ GENDER.FEMALE }>
					<div className="content">
						<p>Oposite to the male names, <span className="female">female names</span> (marked ▲ on chart) tend to be more "unique" in our daily life as well as in film industry.</p>
						<p>However, first 5 most common female character names are more obviously distinguished from the other common names from the other top 100 names. So, we must recognize that real world parents become more diligent and creative calling their baby-girls than writers chosing a name for a new female character.</p>
						<p>But gender is not the only component of the name's popularity in the movies & TV series.</p>
					</div>
				</article>

			</section>
		);
	}
}

export default FrequencyComparisonSection;