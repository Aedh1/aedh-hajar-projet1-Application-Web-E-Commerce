const express = require('express');
const router = express.Router();
const controller = require('../controllers/cartController');

router.get('/', controller.getCart);
router.post('/add', controller.addToCart);
router.post('/remove', controller.removeFromCart);

module.exports = router;
