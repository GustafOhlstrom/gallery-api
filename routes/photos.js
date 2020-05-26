const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
const photoValidationRules = require('../validation_rules/photo');

/* Get all resources */
router.get('/', photoController.index);

/* Store a new resource */
router.post('/', photoValidationRules.createRules, photoController.store);

/* Get a specific resource */
router.get('/:photoId', photoController.show);

/* Update a specific resource */
router.put('/:photoId', photoController.update);

/* Destroy a specific resource */
router.delete('/:photoId', photoController.destroy);

module.exports = router;