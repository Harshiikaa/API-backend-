const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    shoppingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shoppingBag',
        required: true,
    },
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
        type: Number,
        required: true,
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

})

const Orders = mongoose.model('orders', orderSchema);
module.exports = Orders;