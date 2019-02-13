const express = require('express');
const expressValidator = require('express-validator');
const morgan = require('morgan');

const newsRoutes = require('./API/routes/news');
const ErrorHandler = require('./API/handlers/error');

const app = express();
app.use(expressValidator());
app.use(morgan('dev'));

app.use('/news', newsRoutes);

app.use((req, res, next) => {
	next(ErrorHandler.createError({
		status: 501,
		message: 'Resource wasn\'t implemented'
	}));
});

app.use((error, req, res, next) => {
	res.status(
		error.status || 500
	).json({
		error: {
			message: error.message || 'Internal server error'
		}
	});
});

module.exports = app;
