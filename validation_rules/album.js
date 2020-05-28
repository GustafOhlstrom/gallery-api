/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('title').trim().isLength({ min: 1 }),
    body('photo_id').optional().isArray().custom(async values => {
		for (let i = 0; i < values.length; i++) {
			const photo = await models.Photo.fetchById(values[i], { require: false });
			if(!photo) return Promise.reject(`No photo with id ${values[i]} exists`)
		}
	}),
];

const updateRules = [
	body('title').optional().trim().isLength({ min: 1 }),
    body('photo_id').optional().isArray().custom(async values => {
		for (let i = 0; i < values.length; i++) {
			const photo = await models.Photo.fetchById(values[i], { require: false });
			if(!photo) return Promise.reject(`No photo with id ${values[i]} exists`)
		}
	}),
];

module.exports = {
	createRules,
	updateRules,
}