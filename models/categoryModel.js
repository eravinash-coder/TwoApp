const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

categorySchema.statics.findByName = function (categoryName) {
    return this.findOne({ category_name: categoryName });
};
module.exports = mongoose.model('Category', categorySchema)
