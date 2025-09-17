const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const User = require('../models/User');

// Create a new ride request
router.post('/', async (req, res) => {
  const { riderId, pickupLocation, dropoffLocation } = req.body;
  if (!riderId || !pickupLocation || !dropoffLocation) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Prevent booking if user is a driver on an active ride
    const activeAsDriver = await Ride.findOne({ driver: riderId, status: { $in: ['accepted', 'enroute'] } });
    if (activeAsDriver) {
      return res.status(400).json({ error: 'You cannot book a ride while you are a driver on an active ride.' });
    }
    const ride = await Ride.create({
      rider: riderId,
      pickupLocation,
      dropoffLocation,
    });
    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all rides for a user (rider or driver)
router.get('/user/:userId', async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [
        { rider: req.params.userId },
        { driver: req.params.userId },
      ],
    })
      .populate('rider', 'name email')
      .populate('driver', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single ride by ID
router.get('/:rideId', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('rider', 'name email')
      .populate('driver', 'name email');
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
