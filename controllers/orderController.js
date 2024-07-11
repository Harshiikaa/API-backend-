const Orders = require("../model/orderModel");



const createOrder = async (req, res) => {
    console.log(req.body);

    // destructure data 
    const { userID, shoppingItemList, shippingID, totalPayment, paymentMethod, orderStatus, createdAt } = req.body;

    // validate the data 
    if (!userID || !shoppingItemList || !shippingID || !totalPayment || !paymentMethod || !orderStatus || !createdAt)
        return res.json({
            success: false,
            message: "Please fill all the fields"
        });

    let parsedShoppingItemList;
    try {
        // Attempt to parse shoppingItemList from JSON string to array of objects
        parsedShoppingItemList = JSON.parse(shoppingItemList);
        if (!Array.isArray(parsedShoppingItemList)) {
            throw new Error('Invalid shoppingItemList format');
        }
    } catch (error) {
        console.error('Error parsing shoppingItemList:', error);
        return res.status(400).json({
            success: false,
            message: 'Invalid shoppingItemList format'
        });
    }

    // try catch block 
    try {
        const newOrder = new Orders({
            userID,
            shoppingItemList: parsedShoppingItemList,
            shippingID,
            totalPayment,
            paymentMethod,
            orderStatus: orderStatus || "pending",
            createdAt: createdAt || Date.now(),
        });

        await newOrder.save();

        res.status(200).json({
            success: true,
            message: "Your order has been created. Check the status of your order in the order section",
            data: newOrder
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


const getSingleOrder = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.json({
            success: false,
            message: "Order id is required!"
        })
    }
    try {
        const singleOrder = await Orders.findById(id);
        res.json({
            success: true,
            message: "shipping info fetched successfully",
            order: singleOrder

        })

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")

    }
}

const getOrderByUserID = async (req, res) => {
    const id = req.params.id;
    try {
        const order = await Orders.find({ userID: id })
            .populate({
                path: 'shoppingItemList.shoppingBagID',
                model: 'shoppingBag',
                select: 'productID deliveryDate returnDate totalPrice quantity',
                populate: {
                    path: 'productID',
                    model: 'products',
                    select: 'productName productPrice productCategory productDescription productImageURL'
                }
            })
            .exec();

        res.json({
            message: "retrieved",
            success: true,
            order: order,
        });
    } catch (e) {
        res.json({
            message: "error",
            success: false,
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const listOfOrders = await Orders.find()
            .populate({
                path: 'shoppingItemList.shoppingBagID',
                model: 'shoppingBag',
                select: 'productID deliveryDate returnDate totalPrice quantity',
                populate: {
                    path: 'productID',
                    model: 'products',
                    select: 'productName productPrice productCategory productDescription productImageURL'
                }
            })
            .populate({
                path: 'shippingID',
                model: 'shippingInfo',
                select: 'firstName lastName contactNumber city address nearLandmark'
            })
            .exec();

        res.json({
            success: true,
            message: "Orders fetched successfully",
            orders: listOfOrders,
            count: listOfOrders.length,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
};


// const getAllOrders = async (req, res) => {
//     try {
//         const listOfOrders = await Orders.find();
//         res.json({
//             success: true,
//             message: "Products fetched successfully",
//             orders: listOfOrders,
//             count: listOfOrders.length,

//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json("Server Error")

//     }

// }

// const getAllOrders = async (req, res) => {
//     try {
//         const listOfOrders = await Orders.find()
//             .populate({
//                 path: 'shoppingItemList.shoppingBagID',
//                 model: 'shoppingBag',
//                 select: 'productID deliveryDate returnDate totalPrice quantity',
//                 populate: {
//                     path: 'productID',
//                     model: 'products',
//                     select: 'productName productPrice productCategory productDescription productImageURL'
//                 }
//             })
//             .exec();

//         res.json({
//             success: true,
//             message: "Products fetched successfully",
//             orders: listOfOrders,
//             count: listOfOrders.length,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json("Server Error");
//     }
// };



const updateOrderStatus = async (req, res) => {
    console.log(req.body);

    const { orderStatus } = req.body;
    const id = req.params.id;

    // Check if orderStatus is provided
    if (!orderStatus) {
        return res.json({
            success: false,
            message: "orderStatus is required!"
        });
    }

    try {
        // Find the order by ID and update the orderStatus field
        const updatedOrder = await Orders.findByIdAndUpdate(
            id,
            { orderStatus: orderStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found!"
            });
        }

        res.json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const cancelOrder = async (req, res) => {
    const id = req.params.id;
    try {
        const canceledOrder = await Orders.findByIdAndDelete(id);
        if (!canceledOrder) {
            return res.json({
                success: false,
                message: "Item not found in order",
            });
        }

        res.json({
            success: true,
            message: "Order canceled successfully",
            data: canceledOrder,
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
    createOrder,
    getSingleOrder,
    getOrderByUserID,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
};