import React from 'react';

import styles from './styles.css';

import TopNamesHeatMap from './TopNamesHeatMap';

const TopByGenreSection = (props) => {
	return (
		<section className="top-by-genre">
			<TopNamesHeatMap 
				width={ props.width }
				height={ props.height }/>
		</section>
	);
};

export default TopByGenreSection;

