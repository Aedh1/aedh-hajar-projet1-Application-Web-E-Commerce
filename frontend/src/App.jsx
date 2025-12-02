import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Impossible de charger les produits');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCart() {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) return;
      const data = await res.json();
      setCart(data);
    } catch (err) {
      // ignore
    }
  }

  async function addToCart(productId) {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      if (!res.ok) throw new Error('Échec ajout au panier');
      const data = await res.json();
      setCart(data);
    } catch (err) {
      setError(err.message);
    }
  }

  const itemCount = cart.items ? cart.items.reduce((s, i) => s + (i.quantity || 0), 0) : 0;

  return (
    <Layout cartCount={itemCount}>
      <div className="container">
        <h2>Produits</h2>
        {loading && <p>Chargement…</p>}
        {error && <p className="error">{error}</p>}

        <div className="grid">
          {products.map((p) => (
            <div className="card" key={p.id}>
              <h3>{p.name}</h3>
              <p className="desc">{p.description}</p>
              <div className="meta">
                <strong className="price">{p.price} €</strong>
                <button className="btn" onClick={() => addToCart(p.id)}>Ajouter</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
