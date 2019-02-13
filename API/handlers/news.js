const mysql = require('mysql');

const database = require('../../util/database');
const newsValidator = require('../validators/news');

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
}

module.exports = News;
