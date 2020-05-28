/**
 * Photo Controller
 */

const models = require('../models');
const { matchedData, validationResult } = require('express-validator');
const { fetchUser } = require('./user_controller');
const { res200, res500 } = require('./response_controller');

/**
 * Get photo and check if exists and belongs to user
 * Returns photo
 */
const fetchPhoto = async (req, res, relation) => {
	const photo = await models.Photo.fetchById(req.params.photoId, relation ? { require: false, withRelated: relation } : { require: false });
	if (!photo || photo.get("user_id") !== req.user.data.id) {
		res.status(404).send({
			status: 'fail',
			data: 'Photo Not Found',
		});
		return;
	}
	return photo;
}

/**
 * Check if req data passed validation
 * Retruns validated data
 */
const checkValidation = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).send({
			status: 'fail',
			data: errors.array(),
		});
		return;
	}

	// Return extracted validated data
	return matchedData(req);
}

/**
 * Check if album exist and belongs to user
 */
const validateRelatedAlbums = async (req, res, album_id) => {
	for (let i = 0; i < album_id.length; i++) {
		const album = await models.Album.fetchById(album_id[i], { require: false });
		if(!album || album.get("user_id") !== req.user.data.id) {
			res.status(404).send({
				status: 'fail',
				data: `No album with id ${album_id[i]} exists`,
			});
			return;
		}
	}
}


/**
 * Get all resources
 * GET /
 */
const index = async (req, res) => {
	const user = await fetchUser(req, res, 'photos')
	// Extract users photos and return them in a successful response
	const photos = user.related('photos');
	res200(res, 'photos', photos);
}

/**
 * Store a new resource
 * POST /
 */
const store = async (req, res) => {
	// Check and extract validated data
	const {album_id, ...validData} = checkValidation(req, res)
	validData.user_id = req.user.data.id;

	// Save photo to db and album relations if they exists
	try {
		let photo;
		if(!album_id) {
			photo = await new models.Photo(validData).save();
		// Check if all albums exists and belongs to user and update all relations
		} else {
			await validateRelatedAlbums(req, res, album_id);

			photo = await new models.Photo(validData).save();
			await photo.albums().attach(album_id);
			photo = await models.Photo.fetchById(photo.id, { withRelated: 'albums' });
		}
		
		res200(res, 'photo', photo);
	} catch (error) {
		res500(res);
		throw error;
	}
}

/**
 * Get a specific resource
 * GET /:photoId
 */
const show = async (req, res) => {
	const photo = await fetchPhoto(req, res, 'albums');
	res200(res, 'photo', photo);
}

/**
 * Update a specific resource
 * PUT /:photoId
 */
const update = async (req, res) => {
	let photo = await fetchPhoto(req, res, 'albums');

	// Check and extract validated data
	const {album_id, ...validData} = checkValidation(req, res)

	// Save updated photo to db, if album relations exists remove old relations and save new
	try {
		if(!album_id) {
			await photo.save(validData);
		// Check if all albums exists and belongs to user and update all relations
		} else {
			await validateRelatedAlbums(req, res, album_id);

			await photo.save(validData);
			await photo.albums().detach()
			await photo.albums().attach(album_id);
			photo = await models.Photo.fetchById(photo.id, { withRelated: 'albums' });
		}

		res200(res, 'photo', photo);

	} catch (error) {
		res500(res);
		throw error;
	}
}

/**
 * Destroy a specific resource
 * DELETE /:photoId
 */
const destroy = async (req, res) => {
	try {
		const photo = await fetchPhoto(req, res);

		// Delete photo and all its relations
		await photo.albums().detach()
		await photo.destroy();
		
		res.sendStatus(204);
	} catch (error) {
		res500(res);
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
