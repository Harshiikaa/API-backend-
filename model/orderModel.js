const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    shoppingItemList: [{
        shoppingBagID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shoppingBag', // Adjust the reference to your actual product collection name
            required: true,
        }
    }],
    shippingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shippingInfo',
        required: true,
    },
    totalPayment: {
        type: Number,
        required: false,
        default: null,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "PENDING",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

})

const Orders = mongoose.model('orders', orderSchema);
module.exports = Orders;