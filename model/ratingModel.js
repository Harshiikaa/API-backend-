

const mongoose = require('mongoose');
const ratingSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
        max: 5,
    },

});

const Rating = mongoose.model('rating', ratingSchema);
module.exports = Rating;