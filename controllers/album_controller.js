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
	// Get user and related albums & check if user was found
	const user = await models.User.fetchById(req.user.data.id, { require: false, withRelated: 'albums' });
	if (!user) {
		res.status(404).send({
			status: 'fail',
			data: 'User Not Found',
		});
		return;
	}

	// Extract users albums and return them in a successful response
	const albums = user.related('albums');
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
	// Check if req data passed validation
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).send({
			status: 'fail',
			data: errors.array(),
		});
		return;
	}

	// Extract validated data
	const {photo_id, ...validData} = matchedData(req);
	validData.user_id = req.user.data.id;

	// Save album to db and photo relations if they exists
	try {
		let album = await new models.Album(validData).save();
	
		if(photo_id) {
			await album.photos().attach(photo_id);
			album = await models.Album.fetchById(album.id, { withRelated: 'photos' });
		}

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
	// Get album and check if exists and belongs to user
	const album = await models.Album.fetchById(req.params.albumId, { require: false, withRelated: 'photos' });
	if (!album || album.get("user_id") !== req.user.data.id) {
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
const destroy = async (req, res) => {
	try {
		// Get album and check if exists and belongs to user
		const album = await models.Album.fetchById(req.params.albumId, { require: false });
		if (!album || album.get("user_id") !== req.user.data.id) {
			res.status(404).send({
				status: 'fail',
				data: 'Album Not Found',
			});
			return;
		}

		// Delete album and all its relations 
		album.destroy();
		album.photos().detach()
		
		res.sendStatus(204);
	} catch (error) {
		res.status(500).send({
			status: 'error',
			data: 'Exception thrown in database when deleting album.',
		});
		throw error;
	}
}

module.exports = {
	index,
	show,
	store,
	update,
	destroy,
}
