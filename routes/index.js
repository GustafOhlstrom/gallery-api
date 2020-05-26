var express = require('express');
var router = express.Router();

/* GET / */
router.get('/', (req, res) => {
	res.send({
		status: 'success',
		data: 'gallery API'
	});
});

router.use('/albums', require('./albums'));
router.use('/photos', require('./photos'))

module.exports = router;
