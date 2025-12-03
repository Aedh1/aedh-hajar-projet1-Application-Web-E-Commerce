const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'orders.sqlite');

// Initialize database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeTables();
  }
});

/**
 * Initialize database tables if they don't exist
 */
function initializeTables() {
  // Create orders table
  db.run(
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      total_amount REAL NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT DEFAULT 'pending'
    )`,
    (err) => {
      if (err) {
        console.error('Error creating orders table:', err.message);
      } else {
        console.log('Orders table ready');
      }
    }
  );

  // Create order_items table
  db.run(
    `CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )`,
    (err) => {
      if (err) {
        console.error('Error creating order_items table:', err.message);
      } else {
        console.log('Order items table ready');
      }
    }
  );
}

/**
 * Create a new order with its items
 * @param {Object} orderData - { customer_name, customer_email, total_amount }
 * @param {Array} items - Array of { product_id, product_name, quantity, price }
 * @returns {Promise<Object>} - Created order with id
 */
function createOrder(orderData, items) {
  return new Promise((resolve, reject) => {
    const { customer_name, customer_email, total_amount } = orderData;
    const created_at = new Date().toISOString();

    // Insert order
    db.run(
      `INSERT INTO orders (customer_name, customer_email, total_amount, created_at, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [customer_name, customer_email, total_amount, created_at],
      function (err) {
        if (err) {
          return reject(err);
        }

        const orderId = this.lastID;

        // Insert order items
        const insertItemsPromises = items.map((item) => {
          return new Promise((resolveItem, rejectItem) => {
            const { product_id, product_name, quantity, price } = item;

            db.run(
              `INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
               VALUES (?, ?, ?, ?, ?)`,
              [orderId, product_id, product_name, quantity, price],
              (err) => {
                if (err) {
                  rejectItem(err);
                } else {
                  resolveItem();
                }
              }
            );
          });
        });

        // Wait for all items to be inserted
        Promise.all(insertItemsPromises)
          .then(() => {
            resolve({
              id: orderId,
              customer_name,
              customer_email,
              total_amount,
              created_at,
              status: 'pending',
              items: items
            });
          })
          .catch(reject);
      }
    );
  });
}

/**
 * Get all orders with their items
 * @returns {Promise<Array>} - Array of orders with items
 */
function getAllOrders() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, customer_name, customer_email, total_amount, created_at, status
       FROM orders
       ORDER BY created_at DESC`,
      [],
      (err, orders) => {
        if (err) {
          return reject(err);
        }

        if (!orders || orders.length === 0) {
          return resolve([]);
        }

        // Fetch items for all orders
        const ordersWithItems = orders.map((order) => {
          return new Promise((resolveOrder, rejectOrder) => {
            db.all(
              `SELECT product_id, product_name, quantity, price
               FROM order_items
               WHERE order_id = ?`,
              [order.id],
              (err, items) => {
                if (err) {
                  rejectOrder(err);
                } else {
                  resolveOrder({
                    ...order,
                    items: items || []
                  });
                }
              }
            );
          });
        });

        Promise.all(ordersWithItems)
          .then(resolve)
          .catch(reject);
      }
    );
  });
}

/**
 * Get a single order by ID with its items
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} - Order with items
 */
function getOrderById(orderId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, customer_name, customer_email, total_amount, created_at, status
       FROM orders
       WHERE id = ?`,
      [orderId],
      (err, order) => {
        if (err) {
          return reject(err);
        }

        if (!order) {
          return resolve(null);
        }

        // Fetch items for this order
        db.all(
          `SELECT product_id, product_name, quantity, price
           FROM order_items
           WHERE order_id = ?`,
          [orderId],
          (err, items) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                ...order,
                items: items || []
              });
            }
          }
        );
      }
    );
  });
}

/**
 * Update order status
 * @param {number} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<void>}
 */
function updateOrderStatus(orderId, status) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

/**
 * Delete an order and its items
 * @param {number} orderId - Order ID
 * @returns {Promise<void>}
 */
function deleteOrder(orderId) {
  return new Promise((resolve, reject) => {
    // Delete order items first
    db.run(`DELETE FROM order_items WHERE order_id = ?`, [orderId], (err) => {
      if (err) {
        return reject(err);
      }

      // Delete order
      db.run(`DELETE FROM orders WHERE id = ?`, [orderId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

/**
 * Close database connection
 * @returns {Promise<void>}
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Database connection closed');
        resolve();
      }
    });
  });
}

module.exports = {
  db,
  initializeTables,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  closeDatabase
};
