SET @minVotes = 1000;
SET @meanRating = 6.9;

UPDATE movie_names.ratings
	SET overallRating = (averageRating * numVotes + @minVotes * @meanRating) / (numVotes + @minVotes);
