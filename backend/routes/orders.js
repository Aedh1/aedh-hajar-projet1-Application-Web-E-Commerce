const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } = require('../db/sqlite');

/**
 * POST /api/orders
 * Create a new order
 * Body: { customer_name, customer_email, total_amount, items: [...] }
 */
router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_email, total_amount, items } = req.body;

    // Validation
    if (!customer_name || !customer_email || !total_amount || !items || items.length === 0) {
      return res.status(400).json({
        message: 'Missing required fields: customer_name, customer_email, total_amount, items'
      });
    }

    // Create order
    const order = await createOrder(
      { customer_name, customer_email, total_amount },
      items
    );

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

/**
 * GET /api/orders
 * Get all orders
 */
router.get('/', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

/**
 * GET /api/orders/:id
 * Get a single order by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(parseInt(id));

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

/**
 * PUT /api/orders/:id/status
 * Update order status
 * Body: { status }
 */
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    await updateOrderStatus(parseInt(id), status);
    const order = await getOrderById(parseInt(id));

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

/**
 * DELETE /api/orders/:id
 * Delete an order
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteOrder(parseInt(id));
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
});

module.exports = router;
