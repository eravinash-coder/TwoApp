const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const visaController = require('../controllers/visaController');
const multer = require('multer');
const user = express();



user.use(bodyParser.urlencoded({ extended:true }));
user.use(express.static(path.resolve(__dirname,'public')));

var storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./public/uploads')
    },
    filename:(req,file,cb) =>{
        cb(null,file.originalname)
    }
});

var upload = multer({ storage:storage });

router.post('/addvisa', upload.single("file"), visaController.addVisa);


module.exports = router;
