DELETE movies FROM movies
  LEFT JOIN ratings ON ratings.tconst = movies.tconst 
      WHERE ratings.tconst IS NULL;
      