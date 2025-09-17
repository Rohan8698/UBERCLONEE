const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Rating = mongoose.model('Rating', RatingSchema);

// Submit a rating/review
router.post('/', async (req, res) => {
  const { ride, user, driver, rating, review } = req.body;
  if (!ride || !user || !driver || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newRating = await Rating.create({ ride, user, driver, rating, review });
    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all ratings for a driver
router.get('/driver/:driverId', async (req, res) => {
  try {
    const ratings = await Rating.find({ driver: req.params.driverId })
      .populate('user', 'name email')
      .populate('ride');
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
