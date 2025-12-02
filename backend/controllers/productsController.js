const { products } = require('../utils/data');
const { v4: uuidv4 } = require('uuid');

exports.listProducts = async (req, res) => {
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const id = req.params.id;
  const p = products.find((x) => x.id === id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
};

exports.createProduct = async (req, res) => {
  const { name, price, description } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Invalid payload' });
  const newP = { id: uuidv4(), name, price, description: description || '' };
  products.push(newP);
  res.status(201).json(newP);
};
