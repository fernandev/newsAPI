DELIMITER $

CREATE PROCEDURE retrieve_articles (
	IN queryOffset TINYINT
,	IN queryLimit TINYINT
) BEGIN
	SET queryOffset = COALESCE(queryOffset, 0);
	SET queryLimit = COALESCE(queryLimit, 8);

	SELECT *
	FROM articles
		LIMIT queryLimit
		OFFSET queryOffset;
END$

DELIMITER ;
