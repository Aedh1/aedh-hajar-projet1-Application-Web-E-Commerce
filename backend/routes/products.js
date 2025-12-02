const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');

router.get('/', controller.listProducts);
router.get('/:id', controller.getProduct);
router.post('/', controller.createProduct);

module.exports = router;
