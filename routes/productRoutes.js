const router = require('express').Router();
const productController = require("../controllers/productController");
const { authGuardAdmin } = require('../middleware/authGuard');


// Create product API
router.post('/createProduct', productController.createProduct)

// Get all products API
router.get("/getProducts", productController.getAllProducts)

// Get single product API | /getProduct/:id
router.get("/getProduct/:id", productController.getSingleProduct)

// update product API
router.put("/updateProduct/:id", authGuardAdmin, productController.updateProduct)

// delete product API
router.delete("/deleteProduct/:id", authGuardAdmin, productController.deleteProduct)

module.exports = router;