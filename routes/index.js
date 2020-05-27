var express = require('express');
var router = express.Router();
const auth = require('../controllers/middlewares/auth');
const authController = require('../controllers/auth_controller');
const userValidationRules = require('../validation_rules/user');

/* GET / */
router.get('/', (req, res) => {
	res.send({
		status: 'success',
		data: 'gallery API'
	});
});

router.use('/albums', auth.jwtTokenControl, require('./albums'));
router.use('/photos', auth.jwtTokenControl, require('./photos'));

router.post('/register', userValidationRules.createRules, authController.register);
router.post('/login', userValidationRules.createRules, authController.login);

module.exports = router;
