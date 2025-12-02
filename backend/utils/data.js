const { v4: uuidv4 } = require('uuid');

const products = [
  { id: uuidv4(), name: 'T-shirt', price: 19.99, description: 'Coton, coupe classique' },
  { id: uuidv4(), name: 'Jeans', price: 49.99, description: 'Denim bleu foncé' },
  { id: uuidv4(), name: 'Sac', price: 29.99, description: 'Sac à bandoulière' }
];

const cart = { items: [] };

module.exports = { products, cart };
