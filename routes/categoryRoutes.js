const router = require('express').Router();
const categoryController = require("../controllers/categoryController");
const { authGuardAdmin } = require('../middleware/authGuard');


// Create Category API
router.post('/createCategory', categoryController.createCategory)

// Get all Categories API
router.get("/getCategories", categoryController.getAllCategories)

// Get single Category API | /getCategory/:id
// router.get("/getCategory/:id", categoryController.getSingleCategory)

// delete Category API
// router.delete("/deleteCategory/:id", authGuardAdmin, categoryController.deleteCategory)
router.delete("/deleteCategory/:id", categoryController.deleteCategory)


module.exports = router;