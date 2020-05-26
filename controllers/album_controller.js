/**
 * Album Controller
 */

const models = require('../models');

/**
 * Get all resources
 * GET /
 */
const index = async (req, res) => {
	const albums = await models.Album.fetchAll();

	res.send({
		status: 'success',
		data: {
			albums,
		}
	});
}

/**
 * Get a specific resource
 * GET /:albumId
 */
const show = async (req, res) => {
	const album = await models.Album.fetchById(req.params.albumId, { require: false });
	if (!album) {
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}
	
	res.send({
		status: 'success',
		data: { 
			album,
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
 * PUT /:albumId
 */
const update = async (req, res) => {
	res.status(405).send({
		status: 'fail',
		message: 'Method Not Allowed.',
	});
}

/**
 * Destroy a specific resource
 * DELETE /:albumId
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
