/**
 * Album Controller
 */

const models = require('../models');
const { matchedData, validationResult } = require('express-validator');

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
 * Store a new resource
 * POST /
 */
const store = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("Validation failed for creating a album:", errors.array());
		res.status(422).send({
			status: 'fail',
			data: errors.array(),
		});
		return;
	}

	const validData = matchedData(req);
	try {
		const album = await new models.Album(req.body).save();
		res.send({
			status: 'success',
			data: {
				album,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new album.',
		});
		throw error;
	}
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
