const { v4: uuidv4 } = require('uuid');

const products = [
  {
    id: uuidv4(),
    name: 'Nebula Desk Lamp',
    price: 89.0,
    description: 'Sculptural desk lamp with gradient LED panel and touch dimmer. Warm-to-cool color temperature with memory presets.',
    category: 'lighting',
    imageUrl: '/photo/lampe.jpg',
    stock: 12
  },
  {
    id: uuidv4(),
    name: 'Quantum Mechanical Keyboard',
    price: 199.0,
    description: 'Low-profile mechanical keyboard with haptic feedback, programmable layers and per-key RGB. Aluminum frame.',
    category: 'desk',
    imageUrl: '/photo/keyboard.jpg',
    stock: 7
  },
  {
    id: uuidv4(),
    name: 'Aurora Soundbar',
    price: 249.99,
    description: 'Slim soundbar with spatial audio simulation, wireless subwoofer support and adaptive room EQ.',
    category: 'audio',
    imageUrl: '/photo/enceinte.jpg',
    stock: 5
  },
  {
    id: uuidv4(),
    name: 'Orbit Wireless Charger',
    price: 49.5,
    description: 'Magnetic fast wireless charger with ambient glow and anti-slip surface. Works with Qi devices.',
    category: 'accessories',
    imageUrl: '/photo/Orbit Wireless Charger.jpg',
    stock: 24
  },
  {
    id: uuidv4(),
    name: 'Holo Pad 12"',
    price: 329.0,
    description: 'Ultra-thin secondary display with holographic finish, USB-C powered and adjustable tilt.',
    category: 'desk',
    imageUrl: '/photo/Holopad.jpg',
    stock: 4
  },
  {
    id: uuidv4(),
    name: 'Lumen LED Strip',
    price: 39.99,
    description: 'Modular LED strip with app-controlled gradients, synchronizes with audio and animations.',
    category: 'lighting',
    imageUrl: '/photo/Lumen LED Strip.jpg',
    stock: 40
  },
  {
    id: uuidv4(),
    name: 'Echo Orb Speaker',
    price: 119.0,
    description: 'Compact spherical speaker delivering 360° sound with deep bass and touch controls.',
    category: 'audio',
    imageUrl: '/photo/Echo Orb Speaker.jpg',
    stock: 11
  },
  {
    id: uuidv4(),
    name: 'Prism Mousepad',
    price: 24.0,
    description: 'Micro-textured mouse surface with RGB edge lighting and wireless mouse charging pad.',
    category: 'accessories',
    imageUrl: '/photo/Prism Mousepad.jpg',
    stock: 60
  },
  {
    id: uuidv4(),
    name: 'Vertex Monitor Stand',
    price: 159.5,
    description: 'Adjustable monitor stand with integrated cable management and ambient backlight.',
    category: 'desk',
    imageUrl: '/photo/Vertex Monitor Stand.jpg',
    stock: 8
  },
  {
    id: uuidv4(),
    name: 'Pulse Health Monitor',
    price: 69.99,
    description: 'Desk wearable sensor for posture and active break reminders with subtle LED feedback.',
    category: 'accessories',
    imageUrl: '/photo/Pulse Health Monitor.jpg',
    stock: 20
  }
];

const cart = { items: [] };

module.exports = { products, cart };
