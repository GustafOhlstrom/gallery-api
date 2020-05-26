/**
 * Photo Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('title').trim().isLength({ min: 1 }),
    body('url').trim().isURL(),
    body('comment').optional().trim().isLength({ min: 1 }),
    body('album_id').optional().trim().isLength({ min: 1 }).custom(async value => {
        const album = await models.Album.fetchById(value, { require: false });
		if (album) return Promise.resolve();
		return Promise.reject('No album with that id exists');
	}),
];

module.exports = {
	createRules,
}