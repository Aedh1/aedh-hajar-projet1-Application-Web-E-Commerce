# SQLite Database Module

Cette documentation explique comment utiliser le module de base de données SQLite pour persister les commandes.

## Structure

```
backend/
├── db/
│   └── sqlite.js          # Module de base de données SQLite
├── data/
│   └── orders.sqlite      # Fichier de base de données (généré automatiquement)
└── routes/
    └── orders.js          # Routes pour les commandes
```

## Setup

1. **Installation des dépendances**
```bash
npm install
```

Le package `sqlite3` est automatiquement installé.

2. **Initialisation**
Le module SQLite initialise automatiquement les tables au démarrage du serveur :
- Table `orders` : Stocke les informations des commandes
- Table `order_items` : Stocke les détails des articles dans les commandes

## Tables

### orders
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total_amount REAL NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
)
```

**Statuts possibles** : `pending`, `processing`, `completed`, `cancelled`

### order_items
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
)
```

## API Endpoints

### Créer une commande
**POST** `/api/orders`

Request body:
```json
{
  "customer_name": "Jean Dupont",
  "customer_email": "jean@example.com",
  "total_amount": 299.99,
  "items": [
    {
      "product_id": "prod-lamp",
      "product_name": "Nebula Desk Lamp",
      "quantity": 2,
      "price": 89.0
    },
    {
      "product_id": "prod-keyboard",
      "product_name": "Quantum Mechanical Keyboard",
      "quantity": 1,
      "price": 199.0
    }
  ]
}
```

Response (201 Created):
```json
{
  "id": 1,
  "customer_name": "Jean Dupont",
  "customer_email": "jean@example.com",
  "total_amount": 299.99,
  "created_at": "2025-12-03T14:30:00.000Z",
  "status": "pending",
  "items": [...]
}
```

### Récupérer toutes les commandes
**GET** `/api/orders`

Response (200 OK):
```json
[
  {
    "id": 1,
    "customer_name": "Jean Dupont",
    "customer_email": "jean@example.com",
    "total_amount": 299.99,
    "created_at": "2025-12-03T14:30:00.000Z",
    "status": "pending",
    "items": [...]
  }
]
```

### Récupérer une commande par ID
**GET** `/api/orders/:id`

Response (200 OK):
```json
{
  "id": 1,
  "customer_name": "Jean Dupont",
  "customer_email": "jean@example.com",
  "total_amount": 299.99,
  "created_at": "2025-12-03T14:30:00.000Z",
  "status": "pending",
  "items": [...]
}
```

### Mettre à jour le statut d'une commande
**PUT** `/api/orders/:id/status`

Request body:
```json
{
  "status": "processing"
}
```

Statuts valides : `pending`, `processing`, `completed`, `cancelled`

Response (200 OK):
```json
{
  "id": 1,
  "customer_name": "Jean Dupont",
  "customer_email": "jean@example.com",
  "total_amount": 299.99,
  "created_at": "2025-12-03T14:30:00.000Z",
  "status": "processing",
  "items": [...]
}
```

### Supprimer une commande
**DELETE** `/api/orders/:id`

Response (200 OK):
```json
{
  "message": "Order deleted successfully"
}
```

## Module Functions

### createOrder(orderData, items)
Crée une nouvelle commande avec ses articles.

```javascript
const { createOrder } = require('./db/sqlite');

const order = await createOrder(
  { customer_name: 'Jean', customer_email: 'jean@example.com', total_amount: 99.99 },
  [{ product_id: 'prod-1', product_name: 'Product', quantity: 1, price: 99.99 }]
);
```

### getAllOrders()
Récupère toutes les commandes avec leurs articles.

```javascript
const { getAllOrders } = require('./db/sqlite');
const orders = await getAllOrders();
```

### getOrderById(orderId)
Récupère une commande spécifique par ID.

```javascript
const { getOrderById } = require('./db/sqlite');
const order = await getOrderById(1);
```

### updateOrderStatus(orderId, status)
Met à jour le statut d'une commande.

```javascript
const { updateOrderStatus } = require('./db/sqlite');
await updateOrderStatus(1, 'completed');
```

### deleteOrder(orderId)
Supprime une commande et tous ses articles.

```javascript
const { deleteOrder } = require('./db/sqlite');
await deleteOrder(1);
```

## Gestion des Données

### Sauvegarder les données
- Les données sont automatiquement sauvegardées dans `backend/data/orders.sqlite`
- Ce fichier est exclu du versioning Git (voir `.gitignore`)

### Réinitialiser la base de données
Pour recommencer avec une base de données vide, supprimez simplement le fichier :
```bash
rm backend/data/orders.sqlite
```

Au prochain démarrage du serveur, une nouvelle base de données vide sera créée.

## Notes Importantes

1. **Les produits restent en mémoire** : Le module SQLite ne gère que les commandes. Les produits sont toujours gérés en mémoire comme auparavant.
2. **Promises** : Toutes les fonctions du module retournent des Promises et utilisent async/await
3. **Gestion des erreurs** : Les erreurs sont propagées et doivent être gérées dans les contrôleurs
