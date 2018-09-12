I'm going to use imdb for aggregating information about most popular "movie" names.
As soon as I'm interested in dynamic information (by year) to check my guesses, I'll accumulate characters names only from top 100 movies per year.

Subsets of IMDb data are available here (https://www.imdb.com/interfaces/)

title.basics.tsv.gz
- tconst 
- titleType (movie, short, tvseries, tvepisode, video, etc)
- primaryTitle 
- originalTitle 
- startYear 
- genres 

title.principals.tsv.gz
- tconst (string) - alphanumeric unique identifier of the title
- ordering (integer) – a number to uniquely identify rows for a given titleId
- nconst (string) - alphanumeric unique identifier of the name/person
- category (string) - the category of job that person was in
- job (string) - the specific job title if applicable, else '\N'
- characters (string) - the name of the character played if applicable, else '\N'

title.ratings.tsv.gz – Contains the IMDb rating and votes information for titles
- tconst (string) - alphanumeric unique identifier of the title
- averageRating – weighted average of all the individual user ratings
- numVotes - number of votes the title has received

------

How to calculate top movies 

The formula for calculating the Top Rated 250 Titles gives a true Bayesian estimate: weighted rating (WR) = (v ÷ (v+m)) × R + (m ÷ (v+m)) × C where:

    R = average for the movie (mean) = (Rating)
    v = number of votes for the movie = (votes)
    m = minimum votes required to be listed in the Top 250 (currently 3000)
    C = the mean vote across the whole report (currently 6.9)

https://en.wikipedia.org/wiki/IMDb


--- 

I use mysql for imdb datasets preprocessing 