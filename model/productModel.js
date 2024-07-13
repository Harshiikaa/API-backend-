const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    productRentalPrice: {
        type: Number,
        required: true,
    },
    productSecurityDeposit: {
        type: Number,
        required: true,
    },
    productCategory: {
        type: String,
        required: true,
        trim: true,
    },
    productQuantity: {
        type: Number,
        required: true,
    },
    productSize: {
        type: String,
        required: true,
        trim: true,
    },
    productDescription: {
        type: String,
        required: true,
        trim: true,

    },
    productImageURL: {
        type: String,
        required: true,
        trim: true,
    },
    averageRating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
})

const Products = mongoose.model('products', productSchema);
module.exports = Products;