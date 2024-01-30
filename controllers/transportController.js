const Transport = require('../models/transport');
const Member = require('../models/Member');
const Association = require('../models/Association');
const asyncHandler = require("express-async-handler");


exports.addtransport = asyncHandler(async (req, res) => {
    const {
        associationId,
        dealName,
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
            return res.status(400).send('Association not found');
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
            dealName,
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

        const Transports = await Transport.find({ associationId });


        const modifiedtransport = [];

        // Loop through each hotel and check if the member is in its favorites
        for (const transport of Transports) {
            const isFav = transport.favorites.includes(memberId);
            // Flatten the structure
            const responseData = {
                ...transport.toObject(),
                isFav,
            };
            modifiedtransport.push(responseData);
        }

        res.send([{Transport:modifiedtransport}]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getMyTransports = async (req, res) => {
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
            dealName,
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
            dealName,
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

exports.AddorRemovefavorites = asyncHandler(async (req, res) => {
    const memberId = req.user.memberId;
    const id = req.body.TransportId;
  
    try {
      const member = await Member.findById(memberId);
      const transport = await Transport.findById(id);
      
      // Check if member or favorites is null or undefined
      if (!member || !member.favoritesTransport) {
        return res.status(400).json({ success: false, msg: 'Member or favorites not found' });
      }
  
      const alreadyAdded = member.favoritesTransport.find((favId) => favId && favId.toString() === id);
      const alreadyAddedFav = transport.favorites.find((favId) => favId && favId.toString() === memberId);
      if (alreadyAdded && alreadyAddedFav) {
        const updatedMember = await Member.findByIdAndUpdate(memberId, {
          $pull: { favoritesTransport: id },
        }, {
          new: true,
        });
        const updatedtransport = await Transport.findByIdAndUpdate(id, {
            $pull: { favorites: memberId },
          }, {
            new: true,
          });
        res.status(200).send({ message: 'Remove favorites successfully', member: updatedMember ,transport:updatedtransport });
      } else {
        const updatedMember = await Member.findByIdAndUpdate(memberId, {
          $push: { favoritesTransport: id },
        }, {
          new: true,
        });
        const updatedtransport = await Transport.findByIdAndUpdate(id, {
            $push: { favorites: memberId},
          }, {
            new: true,
          });
        res.status(200).send({ message: 'Added favorites successfully', member: updatedMember ,transport:updatedtransport});
      }
    } catch (error) {
      res.status(400).json({ success: false, msg: error.message });
    }
});

exports.getfavoritesTransport = asyncHandler(async (req, res) => {
    const memberId = req.user.memberId;
  
    try {
      const member = await Member.findById(memberId);
  
      // Check if member or favoritesHotel is null or undefined
      if (!member || !member.favoritesTransport) {
        return res.status(400).json({ success: false, msg: 'Member or favorites not found' });
      }
  
      // Assuming Hotel is the model for hotels
      const favoritesTransports = await Transport.find({ _id: { $in: member.favoritesTransport } });
  
      const modifiedTransports = [];

        // Loop through each hotel and check if the member is in its favorites
        for (const favoritesTransport of favoritesTransports) {
            const isFav = true;
            // Flatten the structure
            const responseData = {
                ...favoritesTransport.toObject(),
                isFav,
            };
            modifiedTransports.push(responseData);
        }

        res.send([{ success: true ,favoritesTransport:modifiedTransports}]);
    } catch (error) {
      res.status(400).json({ success: false, msg: error.message });
    }
});