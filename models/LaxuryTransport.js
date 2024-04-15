const mongoose = require('mongoose');

const LaxuryTransportSchema = new mongoose.Schema({
    laxuryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Luxury' },
    name: String,
    title: String,
    information:String,
    video:String,
    amenities: [String],
    image_url: [Object],
    home_url: [Object],
    
});

module.exports = mongoose.model('LaxuryTransport', LaxuryTransportSchema);
