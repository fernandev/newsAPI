DELIMITER $

CREATE PROCEDURE retrieve_most_popular_articles (
	IN queryOffset TINYINT
,	IN queryLimit TINYINT
) BEGIN
	SET queryOffset = COALESCE(queryOffset, 0);
	SET queryLimit = COALESCE(queryLimit, 8);

	SELECT *
	FROM articles
	ORDER BY likes DESC
		LIMIT queryLimit
		OFFSET queryOffset;
END$

DELIMITER ;
