const router = require('express').Router()
const favoriteController = require("../controllers/favoriteController")
const { authGuard } = require('../middleware/authGuard');


router.post('/addFavorite', authGuard, favoriteController.toggleFavorite)
router.get('/getFavoritesByUserID/:id', authGuard, favoriteController.getFavoritesByUserID)
// router.get('/getFavorite/:id', favoriteController.getFavorite)
// router.delete("/removeFavorite/:id", authGuard, favoriteController.removeFavorite)
module.exports = router;