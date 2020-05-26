/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('title').trim().isLength({ min: 1 }),
    body('photo_id').optional().isArray().custom(async values => {
		values.forEach(async value => {
			const photo = await models.Photo.fetchById(value, { require: false });
			if(photo) Promise.reject(`No photo with id ${value} exists`)
		})

	}),
];

module.exports = {
	createRules,
}