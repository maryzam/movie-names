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
						<p className="centered"><small>Click on a name to highlight it over genres</small></p>
					</div>
					<div>
						<p>But if we compare 10 most common names across main cinema genres, 
						we'll find out that movie world is almost as straight in it's preferences as real life.  
						<span className="male">John</span>, <span className="female">Mary</span>, <span className="male">David</span> and <span className="female">Anna</span>  
						are basic picks for a new character no matter what genre we are talking about.</p> 
						<p>Only Historical movies have distinguished themselves from another genres List of top names. 
						However, it's mostly due to the objective reasons rather than the desires of directors and screenwriters. 
						It would be weird to call King Richard - John, wouldn't it? </p>
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

