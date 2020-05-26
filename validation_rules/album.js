/**
 * Album Validation Rules
 */

const { body } = require('express-validator');

const createRules = [
	body('title').trim().isLength({ min: 1 }),
];

module.exports = {
	createRules,
}