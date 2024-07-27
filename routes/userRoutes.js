const router = require('express').Router()
const userController = require("../controllers/userController")
const { authGuard } = require('../middleware/authGuard');


router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/getSingleUser/:id', userController.getSingleUser)
router.get('/getUsers', userController.getAllUsers)
router.put('/updateUser/:id', authGuard, userController.updateUser)
router.delete('/deleteUser/:id', authGuard, userController.deleteUser)
router.post("/resetPassword/:token", userController.resetPassword)
// send email Link For reset Password
router.post("/forgetPassword", userController.forgetPassword);
router.post('/changePassword', userController.changePassword);


module.exports = router;