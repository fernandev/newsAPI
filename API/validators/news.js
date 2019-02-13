const expressValidator = require('express-validator/check');

exports.validate = (method) => {
	const validatorsBySearchMethod = {
		listAllArticles: [
			expressValidator.query('page').optional().isInt({ gt: 0 })
		],
		findById: [
			expressValidator.param('id').isInt({ gt: 0 })
		]
	};

	return validatorsBySearchMethod[method];
};

exports.handler = next => result => {
	if (result.isEmpty()) return;

	if (!next) {
		throw new Error(
			result.array().map(i => `'${i.param}' has ${i.msg.toLowerCase()}`).join(' ')
		);
	} else {
		return next(
			new Error(
				result.array().map(i => `'${i.param}' has ${i.msg.toLowerCase()}`).join('')
			)
		);
	}
};
