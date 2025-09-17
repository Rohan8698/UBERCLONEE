require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Stripe setup
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


// MongoDB connection
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    if (err.message && err.message.includes('failed to connect')) {
      console.error('Possible causes:');
      console.error('- MongoDB Atlas cluster is not running or is unreachable');
      console.error('- MONGODB_URI in .env is incorrect or missing');
      console.error('- Network/firewall issues blocking connection');
      console.error('- Internet connection is down');
    }
  });


// Routes
const userRoutes = require('./routes/users');
const rideRoutes = require('./routes/rides');
const driverRoutes = require('./routes/driver');
const paymentsRoutes = require('./routes/payments');
const razorpayRoutes = require('./routes/razorpay');
const historyRoutes = require('./routes/history');
const ratingsRoutes = require('./routes/ratings');
app.set('stripe', stripe);
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/ratings', ratingsRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Uber Clone Backend Running');
});


// Socket.io events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  // Example: join room for ride updates
  socket.on('joinRide', (rideId) => {
    socket.join(`ride_${rideId}`);
  });
  // Example: leave room
  socket.on('leaveRide', (rideId) => {
    socket.leave(`ride_${rideId}`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
