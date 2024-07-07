const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true,
    },
})

const Categories = mongoose.model('categories', categorySchema);
module.exports = Categories;