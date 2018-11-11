import React from 'react';

import styles from './styles.css';

import GenresTriangle from './GenresTriangle';
import NamesFilter from './NamesFilter' 

class GenresTriangleSection extends React.PureComponent {

	state = {
		nameFilter: ""
	};

	updateFilter = (event) => {
		const filter = event.target.value || "";
		this.setState({ nameFilter: filter.toLowerCase() })
	}

	render() {

		// todo support portrait mode
		const { width, height } = this.props;
		const { nameFilter } = this.state;
		const vizSize = calcVizSize((width - 250), height);
		const descWidth = width - vizSize.width;

		return(
			<section className="genres-triangle">

				<GenresTriangle size={ vizSize } filter= { nameFilter }/>

				<article className="description" style={{ width : descWidth }}>
					<div>
						<h4>Names & Genres</h4>
          				<p>The frequency of the name's occurrence depends on movie genre as well.</p>
          				<p>There are a lot of comedies with main characters called <span className="female">Candy</span>, <span className="female">Tiffany</span>, <span className="male">Randy</span> or <span className="male">Chip</span>. But it can be a bit tricky to find a comedy about <span className="male">Elias</span> or <span className="female">Marian</span>.</p>
         				<p>However, <span className="female">Anna</span>, <span className="female">Teresa</span> and <span className="female">Cecilia</span> are without doubt Drama Queens and <span className="male">Bruce</span>,<span className="male">Wong</span> and <span className="male">Duke</span> are mainly adventure guys.</p>
          				<p><small>Yes, there are obviously more male characters in adventure/action movies & tv series and more female characters in dramas.</small></p>
					</div>
					<NamesFilter onFilterChange={ this.updateFilter }/>
				</article>

			</section>
		);
	}
};

function calcVizSize( maxWidth, height ) {
	const aspectRatio = 2 / Math.sqrt(3);
	const vizWidth = Math.min(maxWidth, height * aspectRatio);
	const vizHeight = vizWidth / aspectRatio;
	return {
		width: Math.floor(vizWidth),
		height: Math.floor(vizHeight)
	}
}

export default GenresTriangleSection;