const util = require('util');
const mysql = require('mysql');

const pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DATABASE_HOST || 'localhost',
	user: process.env.DATABASE_USER || 'root',
	password: process.env.DATABASE_PASSWORD || 'root',
	database: process.env.DATABASE_NAME || 'news'
});

pool.getConnection((err, connection) => {
	const knownErrors = {
		ER_BAD_DB_ERROR: 'Database name was not found',
		PROTOCOL_CONNECTION_LOST: 'Database connection was closed.',
		ER_CON_COUNT_ERROR: 'Database has too many connections.',
		ECONNREFUSED: 'Database connection was refused.',
		ER_NO_SUCH_TABLE: 'Table name was not found'
	};

	if (err) {
		console.error(knownErrors[err.code]);
	} else if (connection) {
		connection.release();
	}
});

pool.query = util.promisify(pool.query);

module.exports = pool;
