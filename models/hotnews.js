const mongoose = require('mongoose');

const FmcTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
});

const FmcToken = mongoose.model('FmcToken', FmcTokenSchema);

module.exports = FmcToken;
