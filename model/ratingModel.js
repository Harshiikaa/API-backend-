// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();
// app.use(express.json());

// const ratingSchema = new mongoose.Schema({
//     productId: mongoose.Schema.Types.ObjectId,
//     userId: mongoose.Schema.Types.ObjectId,
//     rating: { type: Number, required: true, min: 1, max: 5 },
//     createdAt: { type: Date, default: Date.now }
// });

// const Rating = mongoose.model('Rating', ratingSchema);

// app.post('/api/rating', async (req, res) => {
//     const { productId, userId, rating } = req.body;

//     if (!productId || !userId || !rating) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//         const newRating = new Rating({ productId, userId, rating });
//         await newRating.save();
//         res.status(201).json(newRating);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// mongoose.connect('mongodb://localhost:27017/rating-system', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
//     .catch(err => console.error(err));
