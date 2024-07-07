const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect('mongodb+srv://chaudharyharshika8:9JYacs3imos0tE30@cluster0.mlf8mlm.mongodb.net/').then(() => {
        console.log("Connect to Database");
    })

}

// export 
module.exports = connectDB;