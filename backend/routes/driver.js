const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const User = require('../models/User');

// Get all ride requests (for drivers to accept)
router.get('/requests', async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'requested' })
      .populate('rider', 'name email')
      .populate('driver', 'name email');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Driver accepts a ride
router.post('/accept', async (req, res) => {
  const { driverId, rideId } = req.body;
  if (!driverId || !rideId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Prevent accepting if user is a rider on an active ride
    const activeAsRider = await Ride.findOne({ rider: driverId, status: { $in: ['accepted', 'enroute'] } });
    if (activeAsRider) {
      return res.status(400).json({ error: 'You cannot accept a ride as a driver while you are a rider on an active ride.' });
    }
    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { driver: driverId, status: 'accepted' },
      { new: true }
    )
      .populate('rider', 'name email')
      .populate('driver', 'name email');
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Driver declines a ride
// Driver starts a ride
router.post('/start', async (req, res) => {
  const { rideId } = req.body;
  if (!rideId) {
    return res.status(400).json({ error: 'Missing rideId' });
  }
  try {
    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { status: 'enroute' },
      { new: true }
    );
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/decline', async (req, res) => {
  const { rideId } = req.body;
  if (!rideId) {
    return res.status(400).json({ error: 'Missing rideId' });
  }
  try {
    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { status: 'cancelled' },
      { new: true }
    );
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
