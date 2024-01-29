const Package = require('../models/package');
const Member = require('../models/Member');
const Association = require('../models/Association');
const asyncHandler = require("express-async-handler");


exports.addPackage = asyncHandler(async (req, res) => {
    const {
        associationId,
        dealName,
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
            dealName,
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
        const memberId = req.user.memberId;
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

        const modifiedPackage = [];

        // Loop through each hotel and check if the member is in its favorites
        for (const package of Packages) {
            const isFav = package.favorites.includes(memberId);
            // Flatten the structure
            const responseData = {
                ...package.toObject(),
                isFav,
            };
            modifiedPackage.push(responseData);
        }

        res.send([{Packages:modifiedPackage}]);
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

exports.updatePackage = asyncHandler(async (req, res) => {
    try {
        const { PackageId } = req.params;

        // Extract the fields you want to update from req.body
        const {
            dealName,
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

        // Construct an object with the fields to update (exclude undefined values)
        const updateFields = {
            dealName,
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
        };

        // Remove undefined values
        Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

        // Perform the update and get the updated hotel
        const package = await Package.findByIdAndUpdate(PackageId, updateFields, { new: true });

        if (!package) {
            return res.status(400).send('Package not found');
        }

        res.status(200).json({
            success: true,
            msg: "Successfully updated Package",
            data: package,
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});


exports.deletePackage = asyncHandler(async (req, res) => {
    try {
        const { PackageId } = req.params;

        const package = await Package.findByIdAndDelete(PackageId);

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

exports.AddorRemovefavorites = asyncHandler(async (req, res) => {
    const memberId = req.user.memberId;
    const id = req.body.PackageId;
  
    try {
      const member = await Member.findById(memberId);
      const package = await Package.findById(id);
      
      // Check if member or favorites is null or undefined
      if (!member || !member.favoritesPackage) {
        return res.status(400).json({ success: false, msg: 'Member or favorites not found' });
      }
  
      const alreadyAdded = member.favoritesPackage.find((favId) => favId && favId.toString() === id);
      const alreadyAddedFav = package.favorites.find((favId) => favId && favId.toString() === memberId);
      if (alreadyAdded && alreadyAddedFav) {
        const updatedMember = await Member.findByIdAndUpdate(memberId, {
          $pull: { favoritesPackage: id },
        }, {
          new: true,
        });
        const updatedpackage = await Package.findByIdAndUpdate(id, {
            $pull: { favorites: memberId },
          }, {
            new: true,
          });
        res.status(200).send({ message: 'Remove favorites successfully', member: updatedMember ,package:updatedpackage });
      } else {
        const updatedMember = await Member.findByIdAndUpdate(memberId, {
          $push: { favoritesPackage: id },
        }, {
          new: true,
        });
        const updatedpackage = await Package.findByIdAndUpdate(id, {
            $push: { favorites: memberId},
          }, {
            new: true,
          });
        res.status(200).send({ message: 'Added favorites successfully', member: updatedMember ,package:updatedpackage});
      }
    } catch (error) {
      res.status(400).json({ success: false, msg: error.message });
    }
});

exports.getFavoritePackages = asyncHandler(async (req, res) => {
    const memberId = req.user.memberId;
  
    try {
      const member = await Member.findById(memberId);
  
      // Check if member or favoritesHotel is null or undefined
      if (!member || !member.favoritesPackage) {
        return res.status(400).json({ success: false, msg: 'Member or favorites not found' });
      }
  
      // Assuming Hotel is the model for hotels
      const favoritePackage = await Package.find({ _id: { $in: member.favoritesPackage } });
  
      res.status(200).json({ success: true, favoritePackage });
    } catch (error) {
      res.status(400).json({ success: false, msg: error.message });
    }
});