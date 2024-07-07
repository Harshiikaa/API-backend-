const mongoose = require('mongoose');
const shippingInfoSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    nearLandmark: {
        type: String,
        required: true,
    },
});

const ShippingInfo = mongoose.model('shippingInfo', shippingInfoSchema);
module.exports = ShippingInfo;