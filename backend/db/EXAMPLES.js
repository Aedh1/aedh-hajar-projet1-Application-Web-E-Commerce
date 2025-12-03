/**
 * EXEMPLES D'UTILISATION DU MODULE SQLite
 * 
 * Ce fichier montre comment utiliser le module de base de données SQLite
 * pour gérer les commandes dans l'application e-commerce.
 */

// ============================================
// 1. IMPORTATION DU MODULE
// ============================================

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('./sqlite');

// ============================================
// 2. EXEMPLE 1: Créer une nouvelle commande
// ============================================

async function exampleCreateOrder() {
  try {
    const newOrder = await createOrder(
      {
        customer_name: 'Alice Martin',
        customer_email: 'alice@example.com',
        total_amount: 599.99
      },
      [
        {
          product_id: 'prod-lamp',
          product_name: 'Nebula Desk Lamp',
          quantity: 2,
          price: 89.0
        },
        {
          product_id: 'prod-keyboard',
          product_name: 'Quantum Mechanical Keyboard',
          quantity: 1,
          price: 199.0
        },
        {
          product_id: 'prod-speaker',
          product_name: 'Echo Orb Speaker',
          quantity: 2,
          price: 119.0
        }
      ]
    );

    console.log('Commande créée:', newOrder);
    // Output:
    // {
    //   id: 1,
    //   customer_name: 'Alice Martin',
    //   customer_email: 'alice@example.com',
    //   total_amount: 599.99,
    //   created_at: '2025-12-03T14:30:00.000Z',
    //   status: 'pending',
    //   items: [...]
    // }
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

// ============================================
// 3. EXEMPLE 2: Récupérer toutes les commandes
// ============================================

async function exampleGetAllOrders() {
  try {
    const orders = await getAllOrders();
    console.log('Nombre de commandes:', orders.length);
    orders.forEach(order => {
      console.log(`Commande #${order.id}: ${order.customer_name} (${order.status})`);
      console.log(`  Articles: ${order.items.length}`);
      console.log(`  Total: ${order.total_amount}€`);
    });
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

// ============================================
// 4. EXEMPLE 3: Récupérer une commande par ID
// ============================================

async function exampleGetOrderById() {
  try {
    const order = await getOrderById(1);
    if (order) {
      console.log('Commande trouvée:', order);
      console.log('Détails des articles:');
      order.items.forEach(item => {
        console.log(
          `  - ${item.product_name} (x${item.quantity}) : ${item.price}€`
        );
      });
    } else {
      console.log('Commande non trouvée');
    }
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

// ============================================
// 5. EXEMPLE 4: Mettre à jour le statut
// ============================================

async function exampleUpdateOrderStatus() {
  try {
    // Statuts valides: 'pending', 'processing', 'completed', 'cancelled'
    await updateOrderStatus(1, 'processing');
    const updatedOrder = await getOrderById(1);
    console.log('Commande mise à jour:', updatedOrder);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

// ============================================
// 6. EXEMPLE 5: Supprimer une commande
// ============================================

async function exampleDeleteOrder() {
  try {
    await deleteOrder(1);
    console.log('Commande supprimée');

    // Vérifier qu'elle est bien supprimée
    const deletedOrder = await getOrderById(1);
    console.log('Commande existe-t-elle encore?', deletedOrder ? 'Oui' : 'Non');
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

// ============================================
// 7. INTÉGRATION DANS UN CONTRÔLEUR
// ============================================

// Exemple de contrôleur pour les commandes
const orderController = {
  // POST /api/orders - Créer une commande
  createOrder: async (req, res) => {
    try {
      const { customer_name, customer_email, total_amount, items } = req.body;

      // Valider les données
      if (!customer_name || !customer_email || !total_amount || !items || items.length === 0) {
        return res.status(400).json({ message: 'Données manquantes' });
      }

      // Créer la commande
      const order = await createOrder(
        { customer_name, customer_email, total_amount },
        items
      );

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // GET /api/orders - Récupérer toutes les commandes
  getAllOrders: async (req, res) => {
    try {
      const orders = await getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // GET /api/orders/:id - Récupérer une commande
  getOrderById: async (req, res) => {
    try {
      const order = await getOrderById(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // PUT /api/orders/:id/status - Mettre à jour le statut
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: 'Statut manquant' });
      }

      await updateOrderStatus(parseInt(req.params.id), status);
      const order = await getOrderById(parseInt(req.params.id));
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = { exampleCreateOrder, exampleGetAllOrders, exampleGetOrderById };
