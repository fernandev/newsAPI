USE news;

CREATE TABLE `news`.`articles` (
	`id` INT(10) NOT NULL AUTO_INCREMENT
,	`author` VARCHAR(255) NOT NULL
,	`title` VARCHAR(255) NOT NULL
,	`description` VARCHAR(255) NOT NULL
,	`content` LONGTEXT NOT NULL
,	`created_at` DATETIME NULL DEFAULT NOW()
,	`image_url` VARCHAR(2083) NULL
,	`likes` BIGINT(10) NULL DEFAULT 0
,	`country_origin` VARCHAR(100) NOT NULL
,	PRIMARY KEY (`id`)
,	UNIQUE INDEX `UQ_id` (`id` ASC, `author` ASC, `title` ASC)
,	UNIQUE INDEX `UQ_articles_identifiers` (`author` ASC, `title` ASC)
,	INDEX `IX_newest_articles` (`created_at` DESC)
,	INDEX `IX_most_popular` (`likes` DESC)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1
COLLATE = latin1_general_ci;
