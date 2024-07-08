const Rating = require("../model/ratingModel");

const createRating = async (req, res) => {
    console.log(req.body);
    const id = req.user.id;

    // destructure data 
    const {
        userID,
        productID,
        rating,
    } = req.body;

    // validate the data 
    if (!userID || !productID || !rating) {
        return res.json({
            success: false,
            message: "Please provide all the details"
        });
    }

    // try-catch block 
    try {
        const existingRating = await Rating.findOne({
            userID: id,
            productID: productID,
        });

        if (existingRating) {
            return res.json({
                success: false,
                message: "Already Rated"
            });
        }

        // Create a new favorite entry
        const newRating = new Rating({
            userID: id,
            productID: productID,
            rating: rating,
        });

        // Save the new favorite
        await newRating.save();

        res.status(200).json({
            success: true,
            message: "Created Rating",
            data: newRating
        });

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
};

const updateRating = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    const {
        userID,
        productID,
        rating,
    } = req.body;

    const id = req.params.id;
    if (!userID
        || !productID
        || !rating

    ) {
        return res.json({
            success: true,
            message: "All fields are required!"
        })
    }
    try {
        const updatedRating = {
            userID: userID,
            productID: productID,
            rating: rating,

        }
        await Rating.findByIdAndUpdate(id, updatedRating);
        res.json({
            success: true,
            message: "Rating Changed",
            rating: updatedRating
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

module.exports = {
    createRating,
    updateRating
};