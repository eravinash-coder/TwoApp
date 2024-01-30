const DestinationProgram = require('../models/destinationProgram');
const asyncHandler = require("express-async-handler");



exports.addDestinationProgram = asyncHandler(async (req, res) => {
    const { companyName,
        type,
        number,
        email } = req.body;
    try {



        var destinationProgram = new DestinationProgram({
            companyName,
            type,
            number,
            email
        });
        var record = await destinationProgram.save();

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


});