const Rating = require("../model/ratingModel");
const Product = require("../model/productModel");

const upsertRating = async (req, res) => {
    console.log(req.body);
    const userID = req.user.id;
    const { productID, rating } = req.body;

    if (!productID || !rating) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the required details"
        });
    }

    try {
        let existingRating = await Rating.findOne({
            userID: userID,
            productID: productID,
        });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
            await updateProductAverageRating(productID);
            res.json({
                success: true,
                message: "Rating updated successfully",
                data: existingRating
            });
        } else {
            const newRating = new Rating({
                userID: userID,
                productID: productID,
                rating: rating,
            });

            await newRating.save();
            await updateProductAverageRating(productID);
            res.status(201).json({
                success: true,
                message: "Rating created successfully",
                data: newRating
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const updateProductAverageRating = async (productID) => {
    const ratings = await Rating.find({ productID: productID });
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = sumRatings / totalRatings;

    await Product.findByIdAndUpdate(productID, { averageRating: averageRating, ratingCount: totalRatings });
};

module.exports = {
    upsertRating
};


// const Rating = require("../model/ratingModel");
// const Product = require("../model/productModel");

// const createRating = async (req, res) => {
//     console.log(req.body);
//     const id = req.user.id;

//     const { productID, rating } = req.body;

//     if (!productID || !rating) {
//         return res.status(400).json({
//             success: false,
//             message: "Please provide all the required details"
//         });
//     }

//     try {
//         const existingRating = await Rating.findOne({
//             userID: id,
//             productID: productID,
//         });

//         if (existingRating) {
//             return res.status(400).json({
//                 success: false,
//                 message: "You have already rated this product"
//             });
//         }

//         const newRating = new Rating({
//             userID: id,
//             productID: productID,
//             rating: rating,
//         });

//         await newRating.save();

//         await updateProductAverageRating(productID);

//         res.status(201).json({
//             success: true,
//             message: "Rating created successfully",
//             data: newRating
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };

// const updateRating = async (req, res) => {
//     console.log(req.body);

//     const { rating } = req.body;
//     const id = req.params.id;

//     if (!rating) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required!"
//         });
//     }

//     try {
//         const updatedRating = await Rating.findByIdAndUpdate(id, { rating: rating }, { new: true });

//         if (!updatedRating) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Rating not found"
//             });
//         }

//         await updateProductAverageRating(updatedRating.productID);

//         res.json({
//             success: true,
//             message: "Rating updated successfully",
//             rating: updatedRating
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };

// const updateProductAverageRating = async (productID) => {
//     const ratings = await Rating.find({ productID: productID });
//     const totalRatings = ratings.length;
//     const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
//     const averageRating = sumRatings / totalRatings;

//     await Product.findByIdAndUpdate(productID, { averageRating: averageRating, ratingCount: totalRatings });
// };

// module.exports = {
//     createRating,
//     updateRating
// };



// const Rating = require("../model/ratingModel");

// const createRating = async (req, res) => {
//     console.log(req.body);
//     const id = req.user.id;

//     // destructure data
//     const {
//         userID,
//         productID,
//         rating,
//     } = req.body;

//     // validate the data
//     if (!userID || !productID || !rating) {
//         return res.json({
//             success: false,
//             message: "Please provide all the details"
//         });
//     }

//     // try-catch block
//     try {
//         const existingRating = await Rating.findOne({
//             userID: id,
//             productID: productID,
//         });

//         if (existingRating) {
//             return res.json({
//                 success: false,
//                 message: "Already Rated"
//             });
//         }

//         // Create a new favorite entry
//         const newRating = new Rating({
//             userID: id,
//             productID: productID,
//             rating: rating,
//         });

//         // Save the new favorite
//         await newRating.save();

//         res.status(200).json({
//             success: true,
//             message: "Created Rating",
//             data: newRating
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json("Server Error");
//     }
// };

// const updateRating = async (req, res) => {
//     console.log(req.body);
//     console.log(req.files);

//     const {
//         userID,
//         productID,
//         rating,
//     } = req.body;

//     const id = req.params.id;
//     if (!userID
//         || !productID
//         || !rating

//     ) {
//         return res.json({
//             success: true,
//             message: "All fields are required!"
//         })
//     }
//     try {
//         const updatedRating = {
//             userID: userID,
//             productID: productID,
//             rating: rating,

//         }
//         await Rating.findByIdAndUpdate(id, updatedRating);
//         res.json({
//             success: true,
//             message: "Rating Changed",
//             rating: updatedRating
//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             success: false,
//             message: "Server Error"
//         })
//     }
// }

// module.exports = {
//     createRating,
//     updateRating
// };