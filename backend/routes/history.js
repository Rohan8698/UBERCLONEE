const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');

// Get ride history for a user (rider or driver)
router.get('/:userId', async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [
        { rider: req.params.userId },
        { driver: req.params.userId },
      ],
      status: { $in: ['completed', 'cancelled'] },
    })
      .sort({ requestedAt: -1 })
      .populate('rider', 'name email')
      .populate('driver', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
