const express = require('express');
const router = express.Router();

const chaptersController = require('../controllers/chaptersController');
const authassoMiddleware = require('../middleware/authAssoMiddleware');

router.post('/addChapters',authassoMiddleware, chaptersController.addChapters);
router.get('/getChapters/:associationId', chaptersController.getChapters);
router.get('/getAllChapters',authassoMiddleware, chaptersController.getAllChapters);
router.get('/getById/:ChapterId',chaptersController.getChaptersById);
router.put('/editChapters/:ChapterId',chaptersController.editChapters);
router.delete('/deleteChapters/:ChapterId',chaptersController.deleteChapters)

module.exports = router;
