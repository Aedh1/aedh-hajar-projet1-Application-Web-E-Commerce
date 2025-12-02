const express = require('express');
const router = express.Router();
const controller = require('../controllers/cartController');

// GET /api/cart -> get cart
router.get('/', controller.getCart);

// POST /api/cart -> add to cart (convenience endpoint)
router.post('/', controller.addToCart);

// Backwards-compatible endpoints
router.post('/add', controller.addToCart);
router.post('/remove', controller.removeFromCart);

module.exports = router;
