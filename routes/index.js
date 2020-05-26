var express = require('express');
var router = express.Router();

/* GET / */
router.get('/', (req, res) => {
	res.send({
		status: 'success',
		data: {
			info: 'gallery API'
		}
	});
});

module.exports = router;
