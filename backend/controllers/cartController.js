const { cart, products } = require('../utils/data');

exports.getCart = async (req, res) => {
  res.json(cart);
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity <= 0) return res.status(400).json({ message: 'Invalid payload' });
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const existing = cart.items.find((i) => i.product.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product, quantity });
  }
  res.status(200).json(cart);
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'Invalid payload' });
  cart.items = cart.items.filter((i) => i.product.id !== productId);
  res.json(cart);
};
