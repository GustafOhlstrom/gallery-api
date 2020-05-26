const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');

/* Get all resources */
router.get('/', albumController.index);

/* Store a new resource */
router.post('/', albumController.store);

/* Get a specific resource */
router.get('/:albumId', albumController.show);

/* Update a specific resource */
router.put('/:albumId', albumController.update);

/* Destroy a specific resource */
router.delete('/:albumId', albumController.destroy);

module.exports = router;