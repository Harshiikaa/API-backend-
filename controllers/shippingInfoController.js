
const ShippingInfo = require("../model/ShippingInfoModel")

const createShippingInfo = async (req, res) => {
    console.log(req.body);
    const id = req.user.id;

    // destructure data 
    const {
        userID,
        // shoppingBagID,
        firstName,
        lastName,
        contactNumber,
        city,
        address,
        nearLandmark
    } = req.body;


    // validate the data 
    if (!userID  || !firstName || !lastName || !contactNumber || !city || !address || !nearLandmark) {
        return res.json({
            success: false,
            message: "Please provide all the details"
        });
    }

    // try-catch block 
    try {
        const existingInShippingInfo = await ShippingInfo.findOne({
            userID: id,
            // shoppingBagID: shoppingBagID,
            firstName: firstName,
            lastName: lastName,
            contactNumber: contactNumber,
            city: city,
            address: address,
            nearLandmark: nearLandmark
        });

        if (existingInShippingInfo) {
            return res.json({
                success: false,
                message: "This item is already in shipping info"
            });
        }

        // Create a new cart entry
        const newShippingInfo = new ShippingInfo({
            userID: id,
            // shoppingBagID: shoppingBagID,
            firstName: firstName,
            lastName: lastName,
            contactNumber: contactNumber,
            city: city,
            address: address,
            nearLandmark: nearLandmark

        });

        // Save the new cart
        await newShippingInfo.save();

        res.status(200).json({
            success: true,
            message: "Item added to Shipping info",
            data: newShippingInfo
        });

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
};

// GET SINGLE SHIPPING INFO
const getSingleShippingInfo = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.json({
            success: false,
            message: "shipping info id is required!"
        })
    }
    try {
        const singleShippingInfo = await ShippingInfo.findById(id);
        res.json({
            success: true,
            message: "shipping info fetched successfully",
            shippingInfo: singleShippingInfo

        })

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")

    }
}


//GET SHIPPING INFO BY USER
const getShippingInfoByUserID = async (req, res) => {
    const id = req.params.id;
    try {
        const shippingInfo = await ShippingInfo.find({ userID: id });
        res.json({
            message: "retrieved",
            success: true,
            shippingInfo: shippingInfo,
        });
    } catch (e) {
        res.json({
            message: "error",
            success: false,
        });
    }
};


// const getShippingInfoByShoppingID = async (req, res) => {
//     const id = req.params.id;
//     try {
//         const shippingInfo = await ShippingInfo.find({ shoppingID: id });
//         res.json({
//             message: "retrieved",
//             success: true,
//             shippingInfo: shippingInfo,
//         });
//     } catch (e) {
//         res.json({
//             message: "error",
//             success: false,
//         });
//     }
// };

const getShippingInfoByShoppingID = async (req, res) => {
    const id = req.params.id;
    try {
        const shippingInfo = await ShippingInfo.find({ shoppingBagID: id });

        // Extracting required fields from shippingInfo array
        const mappedShippingInfo = shippingInfo.map(info => ({
            // shoppingBagID: info.shoppingBagID,
            firstName: info.firstName,
            lastName: info.lastName,
            contactNumber: info.contactNumber,
            city: info.city,
            address: info.address,
            nearLandmark: info.nearLandmark
        }));

        res.json({
            message: "retrieved",
            success: true,
            shippingInfo: mappedShippingInfo,
        });
    } catch (e) {
        res.json({
            message: "error",
            success: false,
        });
    }
};


// UPDATE SHIPPING INFO
const updateShippingInfo = async (req, res) => {
    console.log(req.body);
    const {
        userID,
        firstName,
        lastName,
        contactNumber,
        city,
        address,
        nearLandmark
    } = req.body;
    const id = req.params.id;
    if (!userID
        || !firstName
        || !lastName
        || !contactNumber
        || !city
        || !address
        || !nearLandmark
    ) {
        return res.json({
            success: true,
            message: "All fields are required!"
        })
    }
    try {
        const updateShippingInfo = {
            userID: userID,
            firstName: firstName,
            lastName: lastName,
            contactNumber: contactNumber,
            city: city,
            address: address,
            nearLandmark: nearLandmark
        }
        await ShippingInfo.findByIdAndUpdate(id, updateShippingInfo);
        res.json({
            success: true,
            message: "ShippingInfo updated successfully",
            shippingInfo: updateShippingInfo
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }

}

// const updateShippingInfo = async (req, res) => {
//     const {
//         userID,
//         shoppingBag,
//         firstName,
//         lastName,
//         contactNumber,
//         city,
//         address,
//         nearLandmark
//     } = req.body;
//     const id = req.params.id;

//     // Check if all required fields are provided
//     if (!userID
//         || !shoppingBag
//         || !firstName
//         || !lastName
//         || !contactNumber
//         || !city
//         || !address
//         || !nearLandmark
//     ) {
//         return res.json({
//             success: false,
//             message: "All fields are required!"
//         });
//     }

//     try {
//         // Convert shoppingBag data into a format suitable for updating
//         const items = shoppingBag.map(item => ({
//             productID: item.productId, // Adjust based on your schema
//             quantity: item.quantity,
//             totalPrice: item.totalPrice,
//             deliveryDate: item.deliveryDate,
//             returnDate: item.returnDate,
//             // Include other necessary fields from shoppingBag items
//         }));

//         const updateShippingInfo = {
//             userID: userID,
//             items: items,
//             firstName: firstName,
//             lastName: lastName,
//             contactNumber: contactNumber,
//             city: city,
//             address: address,
//             nearLandmark: nearLandmark
//         };

//         // Find and update ShippingInfo by ID
//         await ShippingInfo.findByIdAndUpdate(id, updateShippingInfo);

//         res.json({
//             success: true,
//             message: "ShippingInfo updated successfully",
//             shippingInfo: updateShippingInfo
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Server Error"
//         });
//     }
// };



module.exports = { createShippingInfo, getShippingInfoByUserID, getShippingInfoByShoppingID, getSingleShippingInfo, updateShippingInfo };


