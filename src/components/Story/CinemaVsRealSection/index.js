import React from 'react';

import styles from './styles.css';

import FrequencyRatioChart from './FrequencyRatioChart';

const CinemaVsRealSection = ({ width, height, scroll }) => (

		<section className="cinema-vs-real">
			
			<article className="description" style={{ width : width }}>
				<p>My own name is Mary. This is a quite popular girl name in many countries. So, since childhood I've rarely been surprised to meet the namesake in daily life. But movies were a different matter!</p>
				<p>However, after hundred of watched movies and TV serias I assumed that most of the characters had pretty ordinar names as well.
				 James Bond, Jeff Lebowski and Sarah Connor hardly could impress anybody with their first names. <strong>Does it mean that common for real life names are popular in the cinema wold as well?</strong></p>
          		<p>To find out the answer, I took <strong>50 most popular <span className="female">female</span> and <span className="male">male</span> US names</strong> for each decade since 1960 year 
          		and compared their frequency in real live with popularity in movies & TV shows released in the same years.</p>
			</article>

			<FrequencyRatioChart width={ width } height={ height * 0.7 } scroll={ scroll }/>

			<article className="description" style={{ width : width }}>
         		<p>	Thousands of babies called <span className="female">Sophia</span> or <span className="female">Abigail</span>, <span className="male">Mason</span> or <span className="male">Dylan</span> every year. 
         		But writers do not rush to call the main characters with such names.
         		According to the statistic, almost all of the top names are much less common in the film industry rather than in real life. 
         		Seems that they just don't want to use too ordinary names in their scenarios.</p>
         		<p>
         		However, there are always some exceptions from this rule such as <span className="male">Jack</span> (up to x3), <span className="female">Maria</span> (x3), <span className="male">Peter</span> (x2) or <span className="female">Sarah</span> (x4.5).
         		But such names makes only about 5-10% of top each decade. On the other hand, there is a bunch of "cinematic" names such as <span className="male">Simon</span> (20 times more often in movies & tv than in real life) and <span className="female">Kate</span> (20 times more often) which you won't find in the real life top lists.</p>
			</article>

		</section>
	);

export default CinemaVsRealSection;