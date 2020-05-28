/**
 * Album Controller
 */

const models = require('../models');
const { matchedData, validationResult } = require('express-validator');
const { fetchUser } = require('./user_controller');
const { res200, res500 } = require('./response_controller');
const { validatePhoto } = require('./photo_controller');

/**
 * Get album and check if exists and belongs to user
 * Returns album
 */
const fetchAlbum = async (req, res, relation) => {
	const album = await models.Album.fetchById(req.params.albumId, relation ? { require: false, withRelated: relation } : { require: false });
	if (!album || album.get("user_id") !== req.user.data.id) {
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}
	return album;
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
 * Check if photo exist and belongs to user
 */
const validateRelatedPhotos = async (req, res, photo_id) => {
	for (let i = 0; i < photo_id.length; i++) {
		const photo = await models.Photo.fetchById(photo_id[i], { require: false });
		if(!photo || photo.get("user_id") !== req.user.data.id) {
			res.status(404).send({
				status: 'fail',
				data: `No photo with id ${photo_id[i]} exists`,
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
	const user = await fetchUser(req, res, 'albums')
	// Extract users albums and return them in a successful response
	const albums = user.related('albums');
	res200(res, 'albums', albums);
}

/**
 * Store a new resource
 * POST /
 */
const store = async (req, res) => {
	// Check and extract validated data
	
	const {photo_id, ...validData} = checkValidation(req, res);
	validData.user_id = req.user.data.id;

	// Save album to db and photo relations if they exists
	try {
		let album;
		if(!photo_id) {
			album = await new models.Album(validData).save();
		// Check if all photos belongs to user and update all relations
		} else {
			await validateRelatedPhotos(req, res, photo_id);

			album = await new models.Album(validData).save();
			await album.photos().attach(photo_id);
			album = await models.Album.fetchById(album.id, { withRelated: 'photos' });
		}

		res200(res, 'album', album);
	} catch (error) {
		res500(res);
		throw error;
	}
}

/**
 * Get a specific resource
 * GET /:albumId
 */
const show = async (req, res) => {
	const album = await fetchAlbum(req, res, 'photos');
	res200(res, 'album', album);
}

/**
 * Update a specific resource
 * PUT /:albumId
 */
const update = async (req, res) => {
	let album = await fetchAlbum(req, res, 'photos');
	
	// Check and extract validated data
	const {photo_id, ...validData} = checkValidation(req, res)

	// Save updated album to db, if photo relations exists remove old relations and save new
	try {
		
		if(!photo_id) {
			await album.save(validData);
		// Check if all photos exits and belongs to user and update all relations
		} else {
			await validateRelatedPhotos(req, res, photo_id);

			await album.save(validData);
			await album.photos().detach()
			await album.photos().attach(photo_id);
			album = await models.Album.fetchById(album.id, { withRelated: 'photos' });
		}

		res200(res, 'album', album);
	} catch (error) {
		res500(res);
		throw error;
	}
}

/**
 * Destroy a specific resource
 * DELETE /:albumId
 */
const destroy = async (req, res) => {
	try {
		const album = await fetchAlbum(req, res);

		// Delete album and all its relations 
		await album.photos().detach()
		await album.destroy();
		
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
