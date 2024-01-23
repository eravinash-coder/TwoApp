const Transport = require('../models/transport');
const Member = require('../models/Member');
const Association = require('../models/Association');
const asyncHandler = require("express-async-handler");


exports.addtransport = asyncHandler(async (req, res) => {
    const {
        associationId,
        dealNane,
        vechicleCategory,
        fuelType,
        dailyRent,
        costPerKm,
        costPerHours,
        description,
        countryOrState,
        destination,
        expire,
        ContactName,
        ContactNumber,
        ContactEmail
    } = req.body;
    try {
        const associationExists = await Association.findById(associationId);
        if (!associationExists) {
            return res.status(404).send('Association not found');
        }

        // Authentication middleware will verify if the user is the association
        // This check is simplified, and you might want to use a proper middleware
        // Check authMiddleware.js for the actual middleware
        const isAssociation = req.user && req.user.role === 'member';

        if (!isAssociation) {
            return res.status(403).send('Unauthorized');
        }

        var transport = new Transport({
            associationId,
            memberId: req.user.memberId,
            dealNane,
            vechicleCategory,
            fuelType,
            dailyRent,
            costPerKm,
            costPerHours,
            description,
            countryOrState,
            destination,
            expire,
            ContactName,
            ContactNumber,
            ContactEmail,
            addedAt: Date.now(),
        });
        var record = await transport.save();

        // Send success response inside the try block
        res.status(201).json({
            success: true,
            msg: "Successfully Added Transport",
            data: record,
        });

    } catch (error) {
        // Send error response inside the catch block
        res.status(400).json({ success: false, msg: error.message });
    }


});
