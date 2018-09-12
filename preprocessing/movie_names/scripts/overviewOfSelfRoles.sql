SET @total = (SELECT COUNT(1) from characters);

SELECT COUNT(1) / @total from characters
	WHERE (characters LIKE '%Herself%') OR (characters LIKE '%Himself%');

SELECT * from characters
	WHERE (category <> 'self') AND ((characters LIKE '%Herself%') OR (characters LIKE '%Himself%'))
    LIMIT 100;