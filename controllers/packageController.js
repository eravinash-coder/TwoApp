const Package = require('../models/package');
const Member = require('../models/Member');
const Association = require('../models/Association');
const asyncHandler = require("express-async-handler");


exports.addPackage = asyncHandler(async (req, res) => {
    const {
        associationId,
        dealNane,
        duration,
        dealType,
        priceForSame,
        priceForOther,
        airportTransport,
        inclusions,
        hotelCategory,
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
            return res.status(400).send('Association not found');
        }

        // Authentication middleware will verify if the user is the association
        // This check is simplified, and you might want to use a proper middleware
        // Check authMiddleware.js for the actual middleware
        const isAssociation = req.user && req.user.role === 'member';

        if (!isAssociation) {
            return res.status(403).send('Unauthorized');
        }

        var package = new Package({
            associationId,
            memberId: req.user.memberId,
            dealNane,
            duration,
            dealType,
            priceForSame,
            priceForOther,
            airportTransport,
            inclusions,
            hotelCategory,
            description,
            countryOrState,
            destination,
            expire,
            ContactName,
            ContactNumber,
            ContactEmail,
            addedAt: Date.now(),
        });
        var record = await package.save();

        // Send success response inside the try block
        res.status(201).json({
            success: true,
            msg: "Successfully Added Package",
            data: record,
        });

    } catch (error) {
        // Send error response inside the catch block
        res.status(400).json({ success: false, msg: error.message });
    }


});


exports.getPackages = async (req, res) => {
    try {
        const associationId = req.params.associationId;

        const associationExists = await Association.findById(associationId);
        if (!associationExists) {
            return res.status(400).send('Association not found');
        }

        // Authentication middleware will verify if the user is a member of the association
        // This check is simplified, and you might want to use a proper middleware
        // Check authMiddleware.js for the actual middleware
        const isMember = req.user && req.user.role === 'member';

        if (!isMember) {
            return res.status(403).send('Unauthorized');
        }

        const Packages = await Package.find({ associationId });


        // Create an object with the "association" property
        const responseData = { Packages };

        res.send([responseData]);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.getMyPackages = async (req, res) => {
    try {
        
         const memberId = req.user.memberId;

         const memberExists = await Member.findById(memberId);
         if (!memberExists) {
             return res.status(400).send('Member not found');
         }

        // Authentication middleware will verify if the user is a member of the association
        // This check is simplified, and you might want to use a proper middleware
        // Check authMiddleware.js for the actual middleware
         const isMember = req.user && req.user.role === 'member';

         if (!isMember) {
             return res.status(403).send('Unauthorized');
        }
       
        
        const Packages = await Package.find({ memberId });


        // Create an object with the "association" property
        const responseData = { Packages };

        res.send([responseData]);
    } catch (error) {
        res.status(400).send(error.message);
    }
};


exports.deletePackage = asyncHandler(async (req, res) => {
    try {
        const { hotelId } = req.params;

        const package = await Package.findByIdAndDelete(hotelId);

        if (!package) {
            return res.status(400).send('Package not found');
        }

        res.status(200).json({
            success: true,
            msg: "Successfully deleted Package",
            data: package,
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});