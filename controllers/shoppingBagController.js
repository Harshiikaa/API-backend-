const ShoppingBag = require("../model/shoppingBagModel");

const addToShoppingBag = async (req, res) => {
    console.log(req.body);
    const id = req.user.id;

    // destructure data 
    const {
        userID,
        productID,
        deliveryDate,
        returnDate,
        totalPrice,
        quantity,
    } = req.body;


    // validate the data 
    if (!userID || !productID || !deliveryDate || !returnDate || !totalPrice || !quantity) {
        return res.json({
            success: false,
            message: "Please provide all the details"
        });
    }

    // try-catch block 
    try {
        const existingInShoppingBag = await ShoppingBag.findOne({
            userID: id,
            productID: productID,
            deliveryDate: deliveryDate,
            returnDate: returnDate,
            totalPrice: totalPrice,
            quantity: quantity
        });

        if (existingInShoppingBag) {
            return res.json({
                success: false,
                message: "This item is already in shopping Bag"
            });
        }

        // Create a new cart entry
        const newShoppingCart = new ShoppingBag({
            userID: id,
            productID: productID,
            deliveryDate: deliveryDate,
            returnDate: returnDate,
            totalPrice: totalPrice,
            quantity: quantity

        });

        // Save the new cart
        await newShoppingCart.save();

        res.status(200).json({
            success: true,
            message: "Item added to Shopping Bag",
            data: newShoppingCart
        });

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
};

const getShoppingBagByUserID = async (req, res) => {
    const id = req.user.id;
    try {
        const shoppingBag = await ShoppingBag.find({ userID: id }).populate('productID', 'productName productRentalPrice productSecurityDeposit productCategory productQuantity productSize productDescription productImageURL');
        res.json({
            message: "retrieved",
            success: true,
            shoppingBag: shoppingBag,
            // count: userCart.length,
        });
    } catch (e) {
        res.json({
            message: "error",
            success: false,
        });
    }
};

// const getSingleShoppingBag = async (req, res) => {
//     const id = req.params.id;
//     if (!id) {
//         return res.json({
//             success: false,
//             message: "Shopping bag id is required!"
//         })
//     }
//     try {
//         const singleShoppingBag = await ShoppingBag.findById(id);
//         res.json({
//             success: true,
//             message: "Shopping bag fetched successfully",
//             shoppingBag: singleShoppingBag
//         })

//     } catch (error) {
//         console.log(error);
//         res.status(500).json("Server Error")

//     }
// }

const getSingleShoppingBag = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.json({
            success: false,
            message: "Shopping bag id is required!"
        });
    }
    try {
        const singleShoppingBag = await ShoppingBag.findById(id).populate('productID', 'productName productRentalPrice productSecurityDeposit productCategory productQuantity productSize productDescription productImageURL');
        res.json({
            success: true,
            message: "Shopping bag fetched successfully",
            shoppingBag: singleShoppingBag
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// function to update the ShoppingBag
// const updateShoppingBag = async (req, res) => {
//     console.log(req.body);
//     console.log(req.files);

//     const {
//         userID,
//         productID,
//         deliveryDate,
//         returnDate,
//         totalPrice,
//         quantity,

//     } = req.body;


//     const id = req.params.id;
//     if (!userID
//         || !productID
//         || !deliveryDate
//         || !returnDate
//         || !totalPrice
//         || !quantity
//     ) {
//         res.json({
//             success: true,
//             message: "All fields are required!"
//         })
//     }
//     try {
//         const updatedShoppingBag = {
//             userID: userID,
//             productID: productID,
//             deliveryDate: deliveryDate,
//             returnDate: returnDate,
//             totalPrice: totalPrice,
//             quantity: quantity,

//         }
//         await ShoppingBag.findByIdAndUpdate(id, updatedShoppingBag);
//         res.json({
//             success: true,
//             message: "Shopping bag updated successfully",
//             shoppingBag: updatedShoppingBag
//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             success: false,
//             message: "Server Error"
//         })
//     }
// }

const updateShoppingBag = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    const {
        deliveryDate,
        returnDate,
        quantity,
        totalPrice,

    } = req.body;

    const id = req.params.id;
    if (!deliveryDate || !quantity || !returnDate || !totalPrice) {
        return res.json({
            success: false,
            message: "Delivery date and quantity are required!"
        });
    }

    try {
        // Update only the specified fields
        const updatedFields = {
            deliveryDate: deliveryDate,
            quantity: quantity,
            returnDate: returnDate,
            totalPrice: totalPrice,
        };

        const updatedShoppingBag = await ShoppingBag.findByIdAndUpdate(id, updatedFields, { new: true }).populate('productID', 'productName productRentalPrice productSecurityDeposit productCategory productQuantity productSize productDescription productImageURL');

        res.json({
            success: true,
            message: "Shopping bag updated successfully",
            shoppingBag: updatedShoppingBag
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


const removeFromShoppingBag = async (req, res) => {
    const id = req.params.id;
    try {
        const removedFromShoppingCart = await ShoppingBag.findByIdAndDelete(id);
        if (!removedFromShoppingCart) {
            return res.json({
                success: false,
                message: "Item not found in Shopping Bag",
            });
        }

        res.json({
            success: true,
            message: "Item removed from Shopping Bag successfully",
            data: removedFromShoppingCart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};




module.exports = {
    addToShoppingBag,
    getShoppingBagByUserID,
    getSingleShoppingBag,
    updateShoppingBag,
    removeFromShoppingBag

};