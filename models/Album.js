/**
 * Album model
 */

module.exports = (bookshelf) => {
	return bookshelf.model('Album', {
		tableName: 'albums'
	}, {
		fetchById(id, fetchOptions = {}) {
			return new this({ id }).fetch(fetchOptions);
		},
	});
}