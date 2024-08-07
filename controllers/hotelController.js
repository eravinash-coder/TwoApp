const mongoose = require('mongoose');
const Hotel = require('../models/hotel');
const Member = require('../models/Member');
const Association = require('../models/Association');
const asyncHandler = require("express-async-handler");
const hotel = require('../models/hotel');


exports.addHotel = asyncHandler(async (req, res) => {
    const {
        associationId,
        dealName,
        hotelCategory,
        hotelplans,
        dealType,
        priceForOther,
        priceForSame,
        description,
        countryOrState,
        city,
        destination,
        expire,
        ContactName,
        ContactNumber,
        ContactEmail,
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

        var hotel = new Hotel({
            associationId,
            memberId: req.user.memberId,
            dealName,
            hotelCategory,
            hotelplans,
            dealType,
            priceForOther,
            priceForSame,
            description,
            countryOrState,
            city,
            destination,
            expire,
            ContactName,
            ContactNumber,
            ContactEmail,
            addedAt: Date.now(),
        });
        var record = await hotel.save();

        // Send success response inside the try block
        res.status(201).json({
            success: true,
            msg: "Successfully Added Hotel",
            data: record,
        });

    } catch (error) {
        // Send error response inside the catch block
        res.status(400).json({ success: false, msg: error.message });
    }


});

exports.getHotel = async (req, res) => {
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

        const Hotels = await Hotel.find({ associationId }).sort("-addedAt");


        const modifiedHotels = [];

        // Loop through each hotel and check if the member is in its favorites
        for (const hotel of Hotels) { 
            const isFav = hotel.favorites.includes(memberId);
            // Flatten the structure
            const responseData = {
                ...hotel.toObject(),
                isFav,
            };
            modifiedHotels.push(responseData);
        }

        res.send([{hotel:modifiedHotels}]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
exports.getAllHotels = async (req, res) => { 
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

        const Hotels = await Hotel.find({  dealType: '0'  }).sort("-addedAt");


        const modifiedHotels = [];

        // Loop through each hotel and check if the member is in its favorites
        for (const hotel of Hotels) {
            const isFav = hotel.favorites.includes(memberId);
            // Flatten the structure
            const responseData = {
                ...hotel.toObject(),
                isFav,
            };
            modifiedHotels.push(responseData);
        }

        res.send([{hotel:modifiedHotels}]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.getMyHotels = async (req, res) => {
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


        const hotel = await Hotel.find({ memberId });


        // Create an object with the "association" property
        const responseData = { hotel };

        res.send([responseData]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.updateHotel = asyncHandler(async (req, res) => {
    try {
        const { hotelId } = req.params;

        // Extract the fields you want to update from req.body
        const {
            dealName,
            hotelCategory,
            hotelplans,
            dealType,
            priceForOther,
            priceForSame,
            description,
            countryOrState,
            city,
            destination,
            expire,
            ContactName,
            ContactNumber,
            ContactEmail,
        } = req.body;

        // Construct an object with the fields to update (exclude undefined values)
        const updateFields = {
            dealName,
            hotelCategory,
            hotelplans,
            dealType,
            priceForOther,
            priceForSame,
            description,
            countryOrState,
            city,
            destination,
            expire,
            ContactName,
            ContactNumber,
            ContactEmail,
        };

        // Remove undefined values
        Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

        // Perform the update and get the updated hotel
        const hotel = await Hotel.findByIdAndUpdate(hotelId, updateFields, { new: true });

        if (!hotel) {
            return res.status(200).send('Hotel not found');
        }

        res.status(200).json({
            success: true,
            msg: "Successfully updated hotel",
            data: hotel,
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});




exports.deleteHotel = asyncHandler(async (req, res) => {
    try {
        const { hotelId } = req.params;

        const hotel = await Hotel.findByIdAndDelete(hotelId);

        if (!hotel) {
            return res.status(400).send('Hotel not found');
        }

        res.status(200).json({
            success: true,
            msg: "Successfully deleted hotel",
            data: hotel,
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

exports.AddorRemovefavorites = asyncHandler(async (req, res) => {
    const memberId = req.user.memberId;
    const id = req.body.hotelId;
  
    try {
      const member = await Member.findById(memberId);
      const hotel = await Hotel.findById(id);
      
      // Check if member or favorites is null or undefined
      if (!member || !member.favoritesHotel) {
        return res.status(400).json({ success: false, msg: 'Member or favorites not found' });
      }
  
      const alreadyAdded = member.favoritesHotel.find((favId) => favId && favId.toString() === id);
      const alreadyAddedFav = hotel.favorites.find((favId) => favId && favId.toString() === memberId);
      if (alreadyAdded && alreadyAddedFav) {
        const updatedMember = await Member.findByIdAndUpdate(memberId, {
          $pull: { favoritesHotel: id },
        }, {
          new: true,
        });
        const updatedHotel = await Hotel.findByIdAndUpdate(id, {
            $pull: { favorites: memberId },
          }, {
            new: true,
          });
        res.status(200).send({ message: 'Remove favorites successfully', member: updatedMember ,hotel:updatedHotel });
      } else {
        const updatedMember = await Member.findByIdAndUpdate(memberId, {
          $push: { favoritesHotel: id },
        }, {
          new: true,
        });
        const updatedHotel = await Hotel.findByIdAndUpdate(id, {
            $push: { favorites: memberId},
          }, {
            new: true,
          });
        res.status(200).send({ message: 'Added favorites successfully', member: updatedMember ,hotel:updatedHotel});
      }
    } catch (error) {
      res.status(400).json({ success: false, msg: error.message });
    }
});

exports.getFavoriteHotels = asyncHandler(async (req, res) => {
    const memberId = req.user.memberId;
  
    try {
      const member = await Member.findById(memberId);
  
      // Check if member or favoritesHotel is null or undefined
      if (!member || !member.favoritesHotel) {
        return res.status(400).json({ success: false, msg: 'Member or favorites not found' });
      }
  
      // Assuming Hotel is the model for hotels
      const favoriteHotels = await Hotel.find({ _id: { $in: member.favoritesHotel } });
  
      const modifiedHotels = [];

        // Loop through each hotel and check if the member is in its favorites
        for (const favoriteHotel of favoriteHotels) {
            const isFav = true;
            // Flatten the structure
            const responseData = {
                ...favoriteHotel.toObject(),
                isFav,
            };
            modifiedHotels.push(responseData);
        }

        res.send({success: true,favoriteHotels:modifiedHotels});
    } catch (error) {
      res.status(400).json({ success: false, msg: error.message });
    }
});
  