const router = require('express').Router()
const shoppingBagController = require("../controllers/shoppingBagController")
const { authGuard } = require('../middleware/authGuard');


router.post('/addToShoppingBag', authGuard, shoppingBagController.addToShoppingBag)
router.get('/getShoppingBagByUserID/:id', authGuard, shoppingBagController.getShoppingBagByUserID)
router.get("/getSingleShoppingBag/:id", shoppingBagController.getSingleShoppingBag)
router.put("/updateShoppingBag/:id", authGuard, shoppingBagController.updateShoppingBag)
router.delete("/removeFromShoppingBag/:id", authGuard, shoppingBagController.removeFromShoppingBag)
module.exports = router;