/**
 * Album Controller
 */

/**
 * Response with 200 ok success
 */
const res200 = (res, dataKey, dataValue) => {
	res.send({
		status: 'success',
		data: { 
			[dataKey]: dataValue,
		}
	});
}

/**
 * Response with 200 ok success
 */
const res500 = (res) => {
	res.status(500).send({
		status: 'error',
		message: 'Exception thrown in database when creating a new album.',
	});
}

module.exports = {
	res200,
	res500,
}