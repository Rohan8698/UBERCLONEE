const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({ key_id, key_secret });

// Create Razorpay order
router.post('/create-razorpay-order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;
  if (!amount) return res.status(400).json({ error: 'Amount is required' });
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: key_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
