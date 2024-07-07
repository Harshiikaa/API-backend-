const Favorites = require('../model/favoriteModel');

// Add or remove favorite
const toggleFavorite = async (req, res) => {
    const { userID, productID } = req.body;

    try {
        // Check if the favorite already exists
        const favorite = await Favorites.findOne({ userID, productID });

        if (favorite) {
            // If favorite exists, remove it
            await Favorites.deleteOne({ userID, productID });
            res.status(200).json({ message: 'Item removed to Favorite' });
        } else {
            // If favorite does not exist, add it
            const newFavorite = new Favorites({ userID, productID });
            await newFavorite.save();
            res.status(200).json({ message: 'Item added to Favorite' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getFavoritesByUserID = async (req, res) => {
    const id = req.user.id;
    try {
        const userFavorites = await Favorites.find({ userID: id }).populate('productID', 'productName productPrice productCategory productDescription productImageURL');
        console.log(userFavorites)
        res.json({
            message: "retrieved",
            success: true,
            favorites: userFavorites,
            // count: userFavorites.length,
        });
    } catch (e) {
        res.json({
            message: "error",
            success: false,
        });
    }
};




module.exports = { toggleFavorite, getFavoritesByUserID };

