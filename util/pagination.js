class Pagination {
	constructor (resourceURL, itemsPerPage = null) {
		this.resourceURL = resourceURL;
		this.itemsPerPage = itemsPerPage;
	}

	getOffset (currentPage) {
		return this.itemsPerPage * (currentPage - 1);
	}

	getPaginationInformation (recordsCount, currentPage) {
		let paginationInformation = {
			next: null,
			previous: null,
			self: `${this.resourceURL}?page=${currentPage}`
		};

		const recordsBeforeThisPage = (this.itemsPerPage * (currentPage - 1));
		const recordsAfterThisPage = recordsCount - (this.itemsPerPage * currentPage);

		if (recordsBeforeThisPage > 0) {
			paginationInformation.previous = `${this.resourceURL}?page=${Number.parseInt(currentPage - 1, 10)}`;
		}
		if (recordsAfterThisPage > 0) {
			paginationInformation.next = `${this.resourceURL}?page=${Number.parseInt(currentPage + 1, 10)}`;
		}

		return paginationInformation;
	}
}

module.exports = Pagination;
