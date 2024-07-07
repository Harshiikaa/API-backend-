const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Assuming there's a 'users' collection
        required: true,
        index: true,
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
        index: true,
    },
});

// Add unique compound index to prevent duplicates
favoriteSchema.index({ userID: 1, productID: 1 }, { unique: true });

const Favorites = mongoose.model('favorites', favoriteSchema);
module.exports = Favorites;
