const LuxuryCruise = require("../models/luxuryCruise");
const asyncHandler = require("express-async-handler");

exports.AddLuxuryCruise= asyncHandler(async (req, res) => {
    const {
        fname,

        lname,

        phone,

        email,

        destination,

        departurePort,

        LenghtOfTour
    } = req.body;
    try {


        var luxuryCruise = new LuxuryCruise({
            fname,

            lname,

            phone,

            email,

            destination,

            departurePort,

            LenghtOfTour
        });
        var record = await luxuryCruise.save();

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