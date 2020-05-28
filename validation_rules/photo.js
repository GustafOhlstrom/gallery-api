/**
 * Photo Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('title').trim().isLength({ min: 1 }),
    body('url').trim().isURL(),
    body('comment').optional().trim().isLength({ min: 1 }),
    body('album_id').optional().isArray().custom(async values => {
		for (let i = 0; i < values.length; i++) {
			const album = await models.Album.fetchById(values[i], { require: false });
			if(!album) return Promise.reject(`No album with id ${values[i]} exists`)
		}
	}),
];

const updateRules = [
	body('title').optional().trim().isLength({ min: 1 }),
    body('url').optional().trim().isURL(),
    body('comment').optional().optional().trim().isLength({ min: 1 }),
    body('album_id').optional().isArray(),
];

module.exports = {
	createRules,
	updateRules,
}