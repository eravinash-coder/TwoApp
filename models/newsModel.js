const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    author: {
        type: String
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    url: {
        type: String
    },
    urlToImage: [Object],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    categoryName: {
        type: String
    },
    audio: [Object],
    views: {
        type: Number,
        default: 0
    },
    timeToRead: {
        type: String
    },
    comments: [],
    like: {
        type: Number
    },
    addToSlider: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comment: String
    }],
    notifyUser: {
        type: Boolean,
        default: false
    },
    addedAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

newsSchema.pre('save', async function (next) {
    if (this.isModified('categoryName') || this.isNew) {
        try {
            const category = await mongoose.model('Category').findByName(this.categoryName);
            if (category) {
                this.category = category._id;
            }
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('News', newsSchema)
