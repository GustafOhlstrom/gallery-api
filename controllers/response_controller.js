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
 * Response with 500 internal server error
 */
const res500 = (res) => {
	res.status(500).send({
		status: 'error',
		message: 'Exception thrown in database when creating.',
	});
}

module.exports = {
	res200,
	res500,
}