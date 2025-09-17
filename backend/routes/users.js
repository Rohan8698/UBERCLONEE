const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or update user (called after Clerk auth)
router.post('/sync', async (req, res) => {
  const { clerkId, email, name, role, profileImage } = req.body;
  if (!clerkId || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    let user = await User.findOneAndUpdate(
      { clerkId },
      { email, name, role, profileImage },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by Clerk ID
router.get('/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
