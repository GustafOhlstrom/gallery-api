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
	const user = await models.User.fetchById(req.user.data.id, { require: false, withRelated: 'photos' });
	if (!user) {
		res.status(404).send({
			status: 'fail',
			data: 'User Not Found',
		});
		return;
	}

	const photos = user.related('photos');
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
		res.status(422).send({
			status: 'fail',
			data: errors.array(),
		});
		return;
	}


	const {album_id, ...validData} = matchedData(req);
	validData.user_id = req.user.data.id;

	try {
		let photo = await new models.Photo(validData).save();
	
		if(album_id) {
			await photo.albums().attach(album_id);
			photo = await models.Photo.fetchById(photo.id, { withRelated: ['albums']});
		}
		
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
	const photo = await models.Photo.fetchById(req.params.photoId, { require: false, withRelated: ['albums'] });
	if (!photo || photo.get("user_id") !== req.user.data.id) {
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
