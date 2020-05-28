/**
 * Album Controller
 */

const models = require('../models');

/**
 * Get user and check if exists
 * Returns album
 */
const fetchUser = async (req, res, relation) => {
    const user = await models.User.fetchById(req.user.data.id, relation ? { require: false, withRelated: relation } : { require: false });
	if (!user) {
		res.status(404).send({
			status: 'fail',
			data: 'User Not Found',
		});
		return;
    }
    return user
}

module.exports = {
    fetchUser,
}