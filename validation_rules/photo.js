/**
 * Photo Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

const createRules = [
	body('title').trim().isLength({ min: 1 }),
    body('url').trim().isURL(),
    body('comment').optional().trim().isLength({ min: 1 }),
    body('album_id').optional().isArray(),
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