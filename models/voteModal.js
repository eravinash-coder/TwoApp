const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    airport: { type: String, required: true }
});

module.exports = mongoose.model('Vote', VoteSchema);
