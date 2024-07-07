const router = require('express').Router()
const shippingInfoController = require("../controllers/shippingInfoController")
const { authGuard } = require('../middleware/authGuard')


router.post('/createShippingInfo', authGuard, shippingInfoController.createShippingInfo)
router.get('/getSingleShippingInfo/:id', shippingInfoController.getSingleShippingInfo)
router.put('/updateShippingInfo/:id', authGuard, shippingInfoController.updateShippingInfo)
module.exports = router;