# Frontend minimal (React)

Fichiers créés :
- `src/index.jsx` : point d'entrée React
- `src/App.jsx` : composant principal qui consomme l'API backend (/api/products, /api/cart)
- `src/components/Layout.jsx` : Header + container + footer
- `src/styles.css` : styles de base

Intégration rapide (suggestion avec Vite) :

```powershell
# depuis la racine du projet
cd frontend
npm init vite@latest . -- --template react
npm install
# remplacer les fichiers src/ par ceux fournis
npm run dev
```

Note : le frontend attend que le backend écoute sur le même host (localhost) au chemin `/api/*`. En développement vous pouvez utiliser un proxy (config Vite) ou lancer backend sur un port accessible.
