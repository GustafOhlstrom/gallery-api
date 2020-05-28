const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation_rules/album');

/* Get all resources */
router.get('/', albumController.index);

/* Store a new resource */
router.post('/', albumValidationRules.createRules, albumController.store);

/* Get a specific resource */
router.get('/:albumId', albumController.show);

/* Update a specific resource */
router.put('/:albumId', albumValidationRules.updateRules, albumController.update);

/* Destroy a specific resource */
router.delete('/:albumId', albumController.destroy);

module.exports = router;