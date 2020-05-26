/**
 * Photo Controller
 */

const models = require('../models');

/**
 * Get all resources
 * GET /
 */
const index = async (req, res) => {
	const photos = await models.Photo.fetchAll();

	res.send({
		status: 'success',
		data: {
			photos,
		}
	});
}

/**
 * Get a specific resource
 * GET /:photoId
 */
const show = async (req, res) => {
	const photo = await models.Photo.fetchById(req.params.photoId, { require: false });
	if (!photo) {
		res.status(404).send({
			status: 'fail',
			data: 'Photo Not Found',
		});
		return;
	}
	
	res.send({
		status: 'success',
		data: { 
			photo,
		}
	});
}

/**
 * Store a new resource
 * POST /
 */
const store = async (req, res) => {
	res.status(405).send({
		status: 'fail',
		message: 'Method Not Allowed.',
	});
}

/**
 * Update a specific resource
 * PUT /:photoId
 */
const update = async (req, res) => {
	res.status(405).send({
		status: 'fail',
		message: 'Method Not Allowed.',
	});
}

/**
 * Destroy a specific resource
 * DELETE /:photoId
 */
const destroy = (req, res) => {
	res.status(405).send({
		status: 'fail',
		message: 'Method Not Allowed.',
	});
}

module.exports = {
	index,
	show,
	store,
	update,
	destroy,
}
