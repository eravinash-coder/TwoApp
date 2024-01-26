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

exports.getTransport = async (req, res) => {
    try {
        const associationId = req.params.associationId;

        const associationExists = await Association.findById(associationId);
        if (!associationExists) {
            return res.status(404).send('Association not found');
        }

        // Authentication middleware will verify if the user is a member of the association
        // This check is simplified, and you might want to use a proper middleware
        // Check authMiddleware.js for the actual middleware
        const isMember = req.user && req.user.role === 'member';

        if (!isMember) {
            return res.status(403).send('Unauthorized');
        }

        const Transports = await Transport.find({ associationId });


        // Create an object with the "association" property
        const responseData = { Transports };

        res.send([responseData]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getMyTransports = async (req, res) => {
    try {

        const memberId = req.user.memberId;

        const memberExists = await Member.findById(memberId);
        if (!memberExists) {
            return res.status(404).send('Member not found');
        }

        // Authentication middleware will verify if the user is a member of the association
        // This check is simplified, and you might want to use a proper middleware
        // Check authMiddleware.js for the actual middleware
        const isMember = req.user && req.user.role === 'member';

        if (!isMember) {
            return res.status(403).send('Unauthorized');
        }


        const transport = await Transport.find({ memberId });


        // Create an object with the "association" property
        const responseData = { transport };

        res.send([responseData]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.updateTransport = asyncHandler(async (req, res) => {
    try {
        const { TransportId } = req.params;

        // Extract the fields you want to update from req.body
        const {
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

        // Construct an object with the fields to update (exclude undefined values)
        const updateFields = {
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
        };

        // Remove undefined values
        Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

        // Perform the update and get the updated hotel
        const transport = await Transport.findByIdAndUpdate(TransportId, updateFields, { new: true });

        if (!transport) {
            return res.status(400).send('Transport not found');
        }

        res.status(200).json({
            success: true,
            msg: "Successfully updated hotel",
            data: transport,
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

exports.deleteTransport = asyncHandler(async (req, res) => {
    try {
        const { TransportId } = req.params;

        const transport = await Transport.findByIdAndDelete(TransportId);

        if (!transport) {
            return res.status(400).send('Transport not found');
        }

        res.status(200).json({
            success: true,
            msg: "Successfully deleted Transport",
            data: transport,
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});