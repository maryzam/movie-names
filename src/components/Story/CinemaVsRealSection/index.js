import React from 'react';

import styles from './styles.css';

import FrequencyRatioChart from './FrequencyRatioChart';

const CinemaVsRealSection = ({ width, height }) => (

		<section className="cinema-vs-real">
			
			<article className="description" style={{ width : width }}>
			 	<h4>Cinema vs Real Life</h4>
          		<p>Is your name more common in a daily life or in a movie?</p>
          		<p>Let's compare the frequency of top 50 most popular US names according to information from social security card applications and their number of occurrences in the film industry.</p>
         		<p>Almost all of the top 50 names in US are not so popular in movies & tv series. Everyone can easily remember several <span className="real">Christophers</span>, <span className="real">Donalds</span>, <span className="real">Matthews</span>, <span className="real">Patricias</span> or <span className="real">Dorothies</span> from school, University or neighbourhood. But writers do not rush to call the main characters with such names. Seems that they just don't want to use too ordinary names in their scenarios.</p>
          		<p>There are only three exceptions from this rule - <span className="cinema">Frank</span>, <span className="cinema">Paul</span> and <span className="cinema">Sarah</span>. On the other hand, there is a bunch of "cinematic" names such as <span className="cinema">Simon</span> (20 times more often in movies & tv than in real life), <span className="cinema">Kate</span> (20 times more often) and <span className="cinema">Charlie</span> (6 times more oftern).</p>
			</article>

			<FrequencyRatioChart width={ width } height={ height * 0.7 }/>

		</section>
	);

export default CinemaVsRealSection;