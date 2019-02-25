const mysql = require('mysql');

const database = require('../../util/database');
const newsValidator = require('../validators/news');
const ErrorHandler = require('./error');

const PaginationUtil = require('../../util/pagination');

const Pagination = new PaginationUtil('http://localhost:8000/news', 8);// FIXME: Hardcoded path.

class News {
	constructor (itemsPerPage) {
		this.itemsPerPage = itemsPerPage;
	}

	async getArticlesCount () {
		const recordsQuery = await database.query(`
			SELECT COUNT(*) AS recordsCount
			FROM articles
		`);
		return recordsQuery[0].recordsCount;
	}

	async getAllArticles (offset, limit) {
		const preparedStatement = mysql.format(
			'CALL retrieve_all_articles(?, ?)'
			, [offset, limit]
		);

		return database.query(preparedStatement);
	}

	async getLatestArticles (offset, limit) {
		const preparedStatement = mysql.format(
			'CALL retrieve_latest_articles(?, ?)'
			, [offset, limit]
		);

		return database.query(preparedStatement);
	}

	async getPopularArticles (offset, limit) {
		const preparedStatement = mysql.format(
			'CALL retrieve_most_popular_articles(?, ?)'
			, [offset, limit]
		);

		return database.query(preparedStatement);
	}

	async getArticleById (articleId) {
		const preparedStatement = mysql.format(
			'CALL retrieve_article(?)'
			, [articleId]
		);

		return database.query(preparedStatement);
	}

	async computeLike (articleId) {
		const preparedStatement = mysql.format(
			'CALL compute_article_likes(?)'
			, [articleId]
		);

		return database.query(preparedStatement);
	}

	listAllArticles (req, res, next) {
		req.getValidationResult().then(
			newsValidator.handler()
		).then(() => {
			this.getArticlesCount().then(recordsCount => {
				const { page } = req.query;
				const currentPage = Number.parseInt(page, 10) || 1;
				const queryOffset = Pagination.getOffset(currentPage);

				this.getAllArticles(queryOffset).then(databaseData => {
					const queryResults = databaseData[0];
					res.status(200).json({
						count: queryResults.length,
						links: Pagination.getPaginationInformation(recordsCount, currentPage),
						results: queryResults
					});
				});
			}).catch(() => {
				res.status(503).json({
					message: 'There was an error processing this request. Please, try again later.'
				});
			});
		}).catch(error => {
			res.status(400).json({
				message: error.message
			});
		});
	}

	findArticleById (req, res, next) {
		req.getValidationResult().then(
			newsValidator.handler()
		).then(() => {
			const { id } = req.params;
			const articleId = Number.parseInt(id, 10);

			this.getArticleById(articleId).then(databaseData => {
				const queryResults = databaseData[0];
				if (queryResults.length === 0) {
					throw ErrorHandler.createError({
						status: 404,
						message: 'None of the articles matches the criteria.'
					});
				} else if (queryResults.length > 1) {
					throw ErrorHandler.createError({
						status: 409,
						message: 'Multiple articles were found matching this criteria. A database administrator should be contacted.'
					});
				}
				res.status(200).json(
					queryResults[0]
				);
			}).catch(error => {
				res.status(error.status).json({
					message: error.message
				});
			});
		}).catch(error => {
			res.status(400).json({
				message: error.message
			});
		});
	}

	computeArticleLikes (req, res, next) {
		req.getValidationResult().then(
			newsValidator.handler()
		).then(() => {
			const { id } = req.params;
			const articleId = Number.parseInt(id, 10);

			this.computeLike(articleId).then(databaseData => {
				const { affectedRows } = {
					...{ affectedRows: 0 },
					...databaseData
				};

				if (affectedRows === 0) {
					throw ErrorHandler.createError({
						status: 404,
						message: 'None of the articles matches the criteria.'
					});
				} else if (affectedRows > 1) {
					throw ErrorHandler.createError({
						status: 409,
						message: 'Multiple articles were affected. A database administrator should be contacted.'
					});
				}

				res.status(204).json();
			}).catch(error => {
				res.status(error.status).json({
					message: error.message
				});
			});
		}).catch(error => {
			res.status(400).json({
				message: error.message
			});
		});
	}

	listRecentArticles (req, res, next) {
		req.getValidationResult().then(
			newsValidator.handler()
		).then(() => {
			this.getArticlesCount().then(recordsCount => {
				const { page } = req.query;
				const currentPage = Number.parseInt(page, 10) || 1;
				const recentArticlesPagination = new PaginationUtil('http://localhost:8000/news/recent', 8);// FIXME: Hardcoded path.
				const queryOffset = recentArticlesPagination.getOffset(currentPage);

				this.getLatestArticles(queryOffset).then(databaseData => {
					const queryResults = databaseData[0];
					res.status(200).json({
						count: queryResults.length,
						links: recentArticlesPagination.getPaginationInformation(recordsCount, currentPage),
						results: queryResults
					});
				});
			}).catch(() => {
				res.status(503).json({
					message: 'There was an error processing this request. Please, try again later.'
				});
			});
		}).catch(error => {
			res.status(400).json({
				message: error.message
			});
		});
	}

	listPopularArticles (req, res, next) {
		req.getValidationResult().then(
			newsValidator.handler()
		).then(() => {
			this.getArticlesCount().then(recordsCount => {
				const { page } = req.query;
				const currentPage = Number.parseInt(page, 10) || 1;
				const popularArticlesPagination = new PaginationUtil('http://localhost:8000/news/popular', 8);// FIXME: Hardcoded path.
				const queryOffset = popularArticlesPagination.getOffset(currentPage);

				this.getPopularArticles(queryOffset).then(databaseData => {
					const queryResults = databaseData[0];
					res.status(200).json({
						count: queryResults.length,
						links: popularArticlesPagination.getPaginationInformation(recordsCount, currentPage),
						results: queryResults
					});
				});
			}).catch(() => {
				res.status(503).json({
					message: 'There was an error processing this request. Please, try again later.'
				});
			});
		}).catch(error => {
			res.status(400).json({
				message: error.message
			});
		});
	}
}

module.exports = News;
