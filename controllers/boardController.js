const Boards = require('../models/boards');
const Association = require('../models/Association');

exports.addBoards = async (req, res) => {
    try {
        const { associationId, name, post, email, phone, location } = req.body;
        const associationExists = await Association.findById(associationId);
        if (!associationExists) {
            return res.status(404).send('Association not found');
        }
        const boards = new Boards({ associationId, name, post, email, phone, location });
        await boards.save();
        res.status(201).send(' chapters Added successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getBoards = async (req, res) => {
    try {
        const associationId = req.params.associationId
        const boards = await Boards.find({ associationId });
        res.json({
            success: true,
            data: boards,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

