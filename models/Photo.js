/**
 * Photo model
 */

module.exports = (bookshelf) => {
	return bookshelf.model('Photo', {
		tableName: 'photos'
	}, {
		fetchById(id, fetchOptions = {}) {
			return new this({ id }).fetch(fetchOptions);
		},
	});
}