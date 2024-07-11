// const router = require('express').Router()
// const ratingController = require("../controllers/ratingController");
// const { authGuard } = require('../middleware/authGuard');

// // create rating API
// router.post('/createRating', authGuard, ratingController.createRating)
// router.put("/updateRating/:id", authGuard, ratingController.updateRating)

// module.exports = router;

const router = require('express').Router();
const ratingController = require("../controllers/ratingController");
const { authGuard } = require('../middleware/authGuard');

// Upsert rating API (handles both create and update)
router.post('/upsertRating', authGuard, ratingController.upsertRating);

module.exports = router;
