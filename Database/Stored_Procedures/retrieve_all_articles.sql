DELIMITER $

CREATE PROCEDURE retrieve_all_articles (
	IN queryOffset TINYINT
,	IN queryLimit TINYINT
) BEGIN
	SET queryOffset = COALESCE(queryOffset, 0);
	SET queryLimit = COALESCE(queryLimit, 8);

	SELECT *
	FROM articles
	ORDER BY id
		LIMIT queryLimit
		OFFSET queryOffset;
END$

DELIMITER ;
