const mysql = require('mysql');

const database = require('../../util/database');
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

	async getArticles (offset, limit) {
		const preparedStatement = mysql.format(
			'CALL retrieve_articles(?, ?)'
			, [offset, limit]
		);

		return database.query(preparedStatement);
	}

	listAllArticles (req, res, next) {
		const { page } = req.query;
		const currentPage = Number.parseInt(page, 10) || 1;

		this.getArticlesCount().then(recordsCount => {
			const queryOffset = Pagination.getOffset(currentPage);
			this.getArticles(queryOffset).then(databaseData => {
				const queryResults = databaseData[0];
				res.status(200).json({
					count: queryResults.length,
					links: Pagination.getPaginationInformation(recordsCount, currentPage),
					results: queryResults
				});
			});
		}).catch(() => {
			res.status(503).json({
				message: 'There was an error processing that request. Please, try again later.'
			});
		});
	}
}

module.exports = News;
