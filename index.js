// importing important packages
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const cors = require('cors');
const multiparty = require('connect-multiparty')
const cloudinary = require('cloudinary');
const app = express();



// dot env config
dotenv.config();

const corsPolicy = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200

}
app.use(cors(corsPolicy))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// multiplarty middle ware 
app.use(multiparty())
connectDB();


// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// json middleware (to accept json data )
app.use(express.json());

// define port
const PORT = process.env.PORT;


// API End points

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/product', require('./routes/productRoutes'))
app.use('/api/category', require('./routes/categoryRoutes'))
app.use('/api/favorite', require('./routes/favoriteRoutes'))
app.use('/api/shoppingBag', require('./routes/shoppingBagRoutes'))






//run the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);

})

module.exports = app;