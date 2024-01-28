const LaxuryTransport = require("../models/LaxuryTransport");
const asyncHandler = require("express-async-handler");

exports.AddLaxuryTransport = asyncHandler(async (req, res) => {
    const {
            fname,

            lname,

            phone,

            brandOfVehicle,

            numberOfPeople,

            luxury,

            sluxury,

            address
    } = req.body;
    try {
        

        var laxuryTransport = new LaxuryTransport({
            fname,

            lname,

            phone,

            brandOfVehicle,

            numberOfPeople,

            luxury,

            sluxury,

            address
        });
        var record = await laxuryTransport.save();

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