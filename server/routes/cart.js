const express = require('express');
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // Calculate total
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update cart item quantity
router.put('/update/:itemId', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.quantity = quantity;
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.pull(req.params.itemId);
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
