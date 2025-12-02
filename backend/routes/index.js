const express = require('express');
const products = require('./products');
const cart = require('./cart');

const router = express.Router();

router.use('/products', products);
router.use('/cart', cart);

module.exports = router;
