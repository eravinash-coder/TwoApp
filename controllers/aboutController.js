const About = require('../models/about');
const Association = require('../models/Association');

exports.addAbout = async (req, res) => {
    try {
        const { associationId, about } = req.body;

        const associationExists = await Association.findById(associationId);
        if (!associationExists) {
            return res.status(404).send('Association not found');
        }
        const abouts = new About({ associationId, about });
        await abouts.save();
        res.status(201).send(' chapters Added successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAbout = async (req, res) => {
    try {
        const associationId = req.params.associationId
        const abouts = await About.find({ associationId });
        res.json({
            success: true,
            data: abouts,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

