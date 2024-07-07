const mongoose = require('mongoose');
const shoppingBagSchema = mongoose.Schema({
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
    deliveryDate: Date,
    returnDate: Date,
    totalPrice: {
        type: Number,
        required: true,
        default: 0,

    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },

});

const ShoppingBag = mongoose.model('shoppingBag', shoppingBagSchema);
module.exports = ShoppingBag;