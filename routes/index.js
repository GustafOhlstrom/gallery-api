var express = require('express');
var router = express.Router();
const userValidationRules = require('../validation_rules/user');
const authValidationRules = require('../validation_rules/auth');
const authController = require('../controllers/auth_controller')

/* GET / */
router.get('/', (req, res) => {
	res.send({
		status: 'success',
		data: 'gallery API'
	});
});

router.use('/albums', authValidationRules.jwtToken, require('./albums'));
router.use('/photos', authValidationRules.jwtToken, require('./photos'));

router.post('/register', userValidationRules.createRules, authController.register);
router.post('/login', userValidationRules.createRules, authController.login);

module.exports = router;
