class ErrorHandler {
	static createError ({ status, message }) {
		let generatedError = new Error(message);
		generatedError.status = status;
		return generatedError;
	}
}

module.exports = ErrorHandler;
