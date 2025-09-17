const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  rider: { type: String, required: true }, // Clerk user ID
  driver: { type: String }, // Clerk user ID
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  status: { type: String, enum: ['requested', 'accepted', 'enroute', 'completed', 'cancelled'], default: 'requested' },
  fare: { type: Number },
  requestedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model('Ride', RideSchema);
