
const ShippingInfo = require("../model/ShippingInfoModel")

// CREATE SHIPPING INFO 
const createShippingInfo = async (req, res) => {
    console.log(req.body)
    const { firstName, lastName, contactNumber, city, address, nearLandmark } = req.body
    if (!firstName || !lastName || !contactNumber || !city || !address || !nearLandmark) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        })
    }
    try {
        const shippingInfo = new ShippingInfo({
            firstName: firstName,
            lastName: lastName,
            contactNumber: contactNumber,
            city: city,
            address: address,
            nearLandmark: nearLandmark
        })
        await shippingInfo.save()
        res.status(200).json({
            success: true,
            message: "Shipping Info created successfully."
        })
    } catch (error) {
        res.status(500).json("Server error")
    }
}

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


// UPDATE SHIPPING INFO
const updateShippingInfo = async (req, res) => {
    console.log(req.body);
    const {
        firstName,
        lastName,
        contactNumber,
        city,
        address,
        nearLandmark
    } = req.body;
    const id = req.params.id;
    if (!firstName
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


module.exports = { createShippingInfo, getSingleShippingInfo, updateShippingInfo };


