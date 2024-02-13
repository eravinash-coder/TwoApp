const Chapters = require('../models/chapters');
const Association = require('../models/Association');

const multer = require('multer');

const handleUpload = require('../helpers/upload')
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.fields([
    { name: 'image', maxCount: 10 }
]);


function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

exports.addChapters = async (req, res) => {
    try {
        await runMiddleware(req, res, myUploadMiddleware);
        const { associationId, name, post, email, phone, location } = req.body;
        const associationExists = await Association.findById(associationId);
        if (!associationExists) {
            return res.status(404).send('Association not found');
        }


        let imageObjects;

        if (req.files && req.files['image']) {
            imageObjects = await Promise.all(
                req.files['image'].map(async (file) => {
                    const b64 = Buffer.from(file.buffer).toString('base64');
                    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;
                    return handleUpload(dataURI);
                })
            );
        }

        var chapters = new Chapters({
            associationId,
            name,
            post,
            email,
            phone,
            location,
            urlToImage: imageObjects,

        });

        var record = await chapters.save();

        // Send success response inside the try block
        res.status(201).json({
            success: true,
            msg: "Successfully Added",
            data: record,
        });

    } catch (error) {
        // Send error response inside the catch block
        res.status(400).json({ success: false, msg: error.message });
    }
};

exports.getChapters = async (req, res) => {
    try {
        const associationId = req.params.associationId
        const chapters = await Chapters.find({ associationId });

        res.json({
            success: true,
            data: chapters,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

