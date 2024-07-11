const router = require('express').Router()
const orderController = require("../controllers/orderController")
const { authGuard, authGuardAdmin } = require('../middleware/authGuard')


router.post('/createOrder', authGuard, orderController.createOrder)
router.get('/getSingleOrder/:id', orderController.getSingleOrder)
router.get('/getOrderByUserID/:id', orderController.getOrderByUserID)
router.get('/getAllOrders', orderController.getAllOrders)
router.put('/updateOrderStatus/:id', orderController.updateOrderStatus)
router.delete('/cancelOrder/:id', authGuard, orderController.cancelOrder)
module.exports = router;