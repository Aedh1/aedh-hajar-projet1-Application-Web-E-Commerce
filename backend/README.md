# Backend Express - Exemple complet

Ce dossier contient un serveur Express minimal mais complet pour une API e-commerce de démonstration.

Fonctionnalités:
- Routes: /api/products, /api/cart
- Middlewares: helmet, cors, morgan, gestion d'erreurs
- Données en mémoire (pour tests et développement)

Installation et lancement

```powershell
cd backend
npm install
npm run dev    # démarre avec nodemon
npm start      # démar le serveur en production
```

Endpoints principaux
- GET /health
- GET /api/products
- GET /api/products/:id
- POST /api/products            (body: { name, price, description? })
- GET /api/cart
- POST /api/cart/add           (body: { productId, quantity })
- POST /api/cart/remove        (body: { productId })

Tests

Un squelette de test est configuré (Jest + supertest). Pour exécuter les tests :

```powershell
npm test
```
