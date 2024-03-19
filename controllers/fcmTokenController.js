const FcmTokenn = require('../models/hotnews');
const asyncHandler = require("express-async-handler");

exports.AddOrRemoveHotnews = asyncHandler(async (req, res) => {
    const { FmcToken } = req.body; // Assuming token is provided in the request body

    try {
        // Check if the FCM token is provided
        if (!FmcToken) {
            return res.status(400).json({ success: false, msg: 'FCM token is required' });
        }

        let existingToken = await FcmTokenn.findOne({ token: FmcToken }); // Assuming FcmTokenn is the model for FCM tokens
        console.log(existingToken);
        if (existingToken) {
            // Token exists, so we'll remove it (unsubscribe)
            await FcmTokenn.findOneAndDelete({ token: FmcToken });
            return res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
        } else {
            try {
                // Token doesn't exist, so we'll add it (subscribe)
                await FcmTokenn.create({ token: FmcToken });
                return res.status(200).json({ success: true, message: 'Subscribed successfully' });
            } catch (error) {
                // If there's a duplicate key error, it means another request has already inserted the token
                if (error.code === 11000) {
                    existingToken = await FcmTokenn.findOne({ token: FmcToken });
                    return res.status(200).json({ success: true, message: 'Subscribed successfully' });
                }
                throw error; // If it's not a duplicate key error, rethrow the error
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
});


