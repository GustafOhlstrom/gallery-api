/**
 * Auth Controller
 */

const models = require('../models');
const { matchedData, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Register user
 * POST /register
 */
const register = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(422).send({
			status: 'fail',
			data: errors.array(),
		});
		return;
	}

	const validData = matchedData(req);

	try {
		validData.password = await bcrypt.hash(validData.password, models.User.hashSaltRounds);

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when hashing the password.',
		});
		throw error;
	}

	try {
		await new models.User(validData).save();
		res.status(201).send({
			status: 'success',
			data: null,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user.',
		});
		throw error;
	}
}

/**
 * Give access-token for user to use as auth
 * POST /login
 */
const login = async (req, res) => {
	const user = await models.User.login(req.body.email, req.body.password);
	if (!user) {
		res.status(401).send({
			status: 'fail',
			data: 'Authentication Required.',
		});
		return;
	}

	const payload = {
		data: {
			id: user.get('id'),
			email: user.get('email'),
		},
	};

	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h' });

	res.send({
		status: 'success',
		data: {
			access_token,
		},
	});
}

/**
 * Get token from HTTP headers
 */
const getTokenFromHeaders = (req) => {
	if (!req.headers.authorization) return false;
	
	const [authType, token] = req.headers.authorization.split(' ');
	
	if (authType.toLowerCase() !== "bearer") return false;
	return token;
}

module.exports = {
    register,
	login,
	getTokenFromHeaders
}