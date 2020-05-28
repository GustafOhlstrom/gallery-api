/**
 * Auth Validation Rules
 */

const jwt = require('jsonwebtoken');
const { getTokenFromHeaders } = require('../auth_controller');

// Check if user is trusted by verifying jwt token
const jwtTokenControl = (req, res, next) => {
	// Get and check if token exists
	const token = getTokenFromHeaders(req);
	if (!token) {
		res.status(401).send({
			status: 'fail',
			data: 'No token found in request headers.',
		});
		return;
	}

	// Validate token and extract payload
	let payload = null;
	try {
		payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
	} catch (err) {
		res.status(403).send({
			status: 'fail',
			data: 'Authentication Failed.',
		});
		throw err;
	}

	// Attach payload to req.user
	req.user = payload;

	next();
}

module.exports = {
	jwtTokenControl,
}