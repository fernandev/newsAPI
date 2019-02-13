DELIMITER $

CREATE PROCEDURE retrieve_article (
	IN article_id INT
) BEGIN
	SELECT *
	FROM articles
	WHERE id = article_id;
END$

DELIMITER ;
