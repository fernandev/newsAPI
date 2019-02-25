DELIMITER $

CREATE PROCEDURE retrieve_latest_articles (
	IN queryOffset TINYINT
,	IN queryLimit TINYINT
) BEGIN
	SET queryOffset = COALESCE(queryOffset, 0);
	SET queryLimit = COALESCE(queryLimit, 8);

	SELECT *
	FROM articles
	ORDER BY created_at DESC
		LIMIT queryLimit
		OFFSET queryOffset;
END$

DELIMITER ;
