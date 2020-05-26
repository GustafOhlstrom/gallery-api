/**
 * Photo Controller
 */

const models = require('../models');
const { matchedData, validationResult } = require('express-validator');

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
 * Store a new resource
 * POST /
 */
const store = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log("Validation failed for creating a photo:", errors.array());
		res.status(422).send({
			status: 'fail',
			data: errors.array(),
		});
		return;
	}

	const validData = matchedData(req);

	try {
		const photo = await new models.Photo(validData).save();
		res.send({
			status: 'success',
			data: {
				photo,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new photo.',
		});
		throw error;
	}
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
