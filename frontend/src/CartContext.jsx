import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Impossible de charger le panier');
      const data = await res.json();
      setCartItems(data.items || []);
      setError(null);
    } catch (err) {
      console.error('fetchCart error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Accept either a product object or a productId
  async function addToCart(productOrId, quantity = 1) {
    const productId = typeof productOrId === 'object' && productOrId !== null ? productOrId.id : productOrId;
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      if (!res.ok) throw new Error('Échec ajout au panier');
      const data = await res.json();
      setCartItems(data.items || []);
      setError(null);
      // Show toast notification
      addToast('Produit ajouté au panier', 2500);
    } catch (err) {
      console.error('addToCart error:', err);
      setError(err.message);
    }
  }

  async function removeFromCart(productId) {
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (!res.ok) throw new Error('Échec suppression du panier');
      const data = await res.json();
      setCartItems(data.items || []);
      setError(null);
    } catch (err) {
      console.error('removeFromCart error:', err);
      setError(err.message);
    }
  }

  async function updateQuantity(productId, quantity) {
    // For this demo backend does not expose a dedicated update endpoint.
    // We'll emulate by removing then adding the product with new quantity via API.
    try {
      // If quantity is 0, remove
      if (!quantity || quantity <= 0) return removeFromCart(productId);
      // Some backends would provide update; here call remove then add
      // but our backend supports adding which overwrites quantities on server-side in many implementations.
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      if (!res.ok) throw new Error('Échec mise à jour quantité');
      const data = await res.json();
      setCartItems(data.items || []);
      setError(null);
    } catch (err) {
      console.error('updateQuantity error:', err);
      setError(err.message);
    }
  }

  async function clearCart() {
    try {
      // Try DELETE endpoint first; if it doesn't exist, fall back to removing items one by one
      const deleteRes = await fetch('/api/cart', { method: 'DELETE' });
      if (deleteRes.ok) {
        setCartItems([]);
        setError(null);
        return;
      }
      // Fallback: remove items one by one
      const ids = cartItems.map((i) => i.product.id);
      for (const id of ids) {
        // eslint-disable-next-line no-await-in-loop
        await fetch('/api/cart/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id })
        });
      }
      setCartItems([]);
      setError(null);
    } catch (err) {
      console.error('clearCart error:', err);
      setError(err.message);
    }
  }

  const subtotal = cartItems.reduce((s, it) => s + (it.product?.price || 0) * (it.quantity || 0), 0);
  const total = subtotal; // taxes/shipping could be added here

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    total
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
