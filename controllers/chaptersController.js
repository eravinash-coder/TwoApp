const Chapters = require('../models/chapters');
const Association = require('../models/Association');

exports.addChapters = async (req, res) => {
    try {
        const { associationId, name, post, email, phone, location } = req.body;

        const associationExists = await Association.findById(associationId);
        if (!associationExists) {
            return res.status(404).send('Association not found');
        }


        const chapters = new Chapters({ associationId, name, post, email, phone, location });
        await chapters.save();
        res.status(201).send(' chapters Added successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getChapters = asyncHandler(async (req, res) => {

    const { associationId } = req.body;

    let chapters = await Chapters.findById(associationId);



    res.json({
        success: true,
        data: chapters,
    });
});

