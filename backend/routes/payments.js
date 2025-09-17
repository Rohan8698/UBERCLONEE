const express = require('express');
const router = express.Router();

// Create a Stripe payment intent
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'usd' } = req.body;
  if (!amount) return res.status(400).json({ error: 'Amount is required' });
  try {
    const paymentIntent = await req.app.get('stripe').paymentIntents.create({
      amount,
      currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
