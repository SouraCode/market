const express = require('express');
const Order = require('../models/Order');
const router = express.Router();
require('dotenv').config();

// Razorpay integration
const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpayInstance = null;
if (process.env.RP_KEY_ID && process.env.RP_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RP_KEY_ID,
    key_secret: process.env.RP_KEY_SECRET
  });
}

// Create Razorpay order (client calls this to get order id)
router.post('/razorpay/create-order', async (req, res) => {
  if (!razorpayInstance) return res.status(500).json({ message: 'Razorpay not configured' });
  const { orderId } = req.body; // existing app order id
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Razorpay expects amount in paise (INR * 100)
    const amountInPaise = Math.round((order.total + order.total * 0.08) * 100);
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_rcpt_${orderId}`,
      payment_capture: 1
    };

    const rOrder = await razorpayInstance.orders.create(options);
    return res.json({ rOrder, orderId });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
  }
});

// Verify Razorpay payment signature and mark order paid
router.post('/razorpay/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  if (!razorpayInstance) return res.status(500).json({ message: 'Razorpay not configured' });
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    return res.status(400).json({ message: 'Missing parameters for verification' });
  }

  try {
    const generatedSignature = crypto.createHmac('sha256', process.env.RP_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      order.status = 'paid';
      order.paymentDetails = { provider: 'razorpay', paymentId: razorpay_payment_id, razorpayOrderId: razorpay_order_id };
      await order.save();
      return res.json({ success: true, order });
    }

    return res.status(400).json({ message: 'Invalid signature' });
  } catch (error) {
    return res.status(500).json({ message: 'Razorpay verification failed', error: error.message });
  }
});

// UPI: create payment payload (simple demo - returns UPI URI to convert to QR)
router.post('/upi/create', async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: 'Missing orderId' });
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // build a UPI deep link using env-configured VPA (merchant VPA)
    const vpa = process.env.UPI_VPA || ''; // e.g. merchant@upi
    const merchantName = process.env.UPI_MERCHANT_NAME || 'Merchant';
    if (!vpa) return res.status(500).json({ message: 'UPI not configured (UPI_VPA missing)' });

    const amount = order.total.toFixed(2);
    const upiUri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(merchantName)}&am=${encodeURIComponent(amount)}&cu=INR&tn=Order%20${orderId}`;

    // Return URI; client may convert to QR or use deep link
    return res.json({ upiUri, orderId, amount });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create UPI payload', error: error.message });
  }
});

// UPI confirm (demo) - mark order as paid (in production, validate with payment provider/webhook)
router.post('/upi/confirm', async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: 'Missing orderId' });
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'paid';
    order.paymentDetails = { provider: 'upi', confirmedAt: new Date() };
    await order.save();

    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to confirm UPI payment', error: error.message });
  }
});

module.exports = router;
