const mongoose = require('mongoose');

const laxuryHotelSchema = new mongoose.Schema({
    laxuryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Luxury' },
    name: String,
    title: String,
    address: String,
    city: String,
    country: String,
    access: String,
    information:String,
    video:String,
    amenities: [String],
    image_url: [Object],
    home_url: [Object],
    website: String
});

module.exports = mongoose.model('LaxuryHotel', laxuryHotelSchema);
