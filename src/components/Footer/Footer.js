import React, { Fragment } from 'react';

const Footer = () => (
	<footer>
		<div className="content">
			<h4>Data and Methodology</h4>
			<p>
				This research is moustly based on two data sets. First one - <a href="https://www.ssa.gov/oact/babynames/index.html" target="_blank" rel="noopener noreferrer">"Baby Names from Social Security Card Applications"</a>, published by Social Security Administration of the USA, contains the information about name, year of birth, sex and total number from a 100 percent sample of Social Security card applications after 1879. Second one  - <a href="" target="_blank" rel="noopener noreferrer">IMDb Datasets</a>,owned and distributed by IMDb.com, provides the various data related to films, television programs and TV series.
			</p>
			<p>
				The period from 1960 to nowadays was chosen as a basic time interval as as long enough to reveal common patterns and key differences between our dayly life and cinematic world and relevant to modern life at the same time. All data, related to early years was ignored for both datasets.
			</p>
			<p>
				"Baby Names from Social Security Card Applications" dataset originally presented all information about naming in the US in already aggregated by years and gender and it didn't reqired any advansed data preprocessing. 
			</p>
			<p>
				On the other hand, I was fully responsible for gathering simmilar data for movies & TS series using overall information about films & additional data about their main and secondary characters. During this process I've excluded not only too old pictures, but also all documantary movies and TV shows, which have their own naming rules bases moustly not on the screenwriter but on an actual names of the heroes and could distort the final results of the research. The final movie list contains 389.187 films, short movies and TV series.
			</p>
			<p>
				All togeter these pictures allowed me to gathering information about names, used by almoust a million cinema characters. I've used a set of text mining algorithms to extract actual first names of heroes and distinguish them from last names, nicknames, official titles & ranks. You just can't imaging how many characters were called "Guy" or "That Old Lady" during the last 70 years!
			</p>
			<p>
				To make the frequency statistic for ciname world more accurate from the list of characters were removed duplicates that mentoned in different movies and/or TV series, but actually references to the same character such as Captain James Kirk, Princess Leia or Mr James Bond.
			</p>
			<p>
				Gender was determined based on gender of a person who used to play the character. I assumed that it's not the most accurate way to determ this parameter and, unfortunatly, it forced me to focused on "female" and "male" cetegories only. However, this assumption shouldn't significantly affect the final conclusions as soon as they explored the most common situations.
			</p>
			<p>All source code and result datasets, used for this article are availabe on <a href="https://github.com/maryzam/movie-names"  target="_blank" rel="noopener noreferrer">GitHub</a></p>
		</div>
	</footer>
);

export default Footer;