/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('title').trim().isLength({ min: 1 }),
    body('photo_id').optional().isArray(),
];

const updateRules = [
	body('title').optional().trim().isLength({ min: 1 }),
    body('photo_id').optional().isArray(),
];

module.exports = {
	createRules,
	updateRules,
}