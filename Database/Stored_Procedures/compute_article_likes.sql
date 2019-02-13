DELIMITER $

CREATE PROCEDURE compute_article_likes (
	IN article_id INT
) BEGIN
	UPDATE articles
	SET likes = (COALESCE(likes, 0) + 1)
	WHERE id = article_id;
END$

DELIMITER ;
