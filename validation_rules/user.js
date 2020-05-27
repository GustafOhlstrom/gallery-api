/**
 * User Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
    body('email').trim().isEmail().custom(async value => {
		const user = await new models.User({ email: value }).fetch({ require: false });
		if(user) return Promise.reject('Email already exists.');
		return Promise.resolve();
	}),
	body('password').trim().isLength({ min: 3 }),
	body('first_name').trim().isLength({ min: 1 }),
	body('last_name').trim().isLength({ min: 1 }),
];

module.exports = {
	createRules,
}