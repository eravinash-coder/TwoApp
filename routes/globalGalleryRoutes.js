const express = require('express');
const router = express.Router();
const globalGalleryController = require('../controllers/globalGalleryController')

router.post('/createGlobalGallery', globalGalleryController.createGlobalGallery);
router.get('/getAllGlobalGallerys', globalGalleryController.getAllGlobalGallerys);
router.get('/getGalleryByCategory', globalGalleryController.getGalleryByCategory);
router.put('/updateGlobalGallery/:id', globalGalleryController.updateGlobalGallery);
router.delete('/deleteGlobalGallery/:id', globalGalleryController.deleteGlobalGallery);
router.get('/getById/:id', globalGalleryController.getGlobalGalleryById);

module.exports = router;
