import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ToastContainer from './components/ToastContainer';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentConfirmationPage from './pages/PaymentConfirmationPage';
import productsFallback from './data/products';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
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
      // fallback to bundled demo products when API is unavailable
      setProducts(productsFallback);
    } finally {
      setLoading(false);
    }
  }

  // cart is provided by CartContext now

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CatalogPage products={products} loading={loading} error={error} />} />
        <Route path="/catalog" element={<CatalogPage products={products} loading={loading} error={error} />} />
        <Route path="/product/:id" element={<ProductPage products={products} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmationPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <ToastContainer />
    </Layout>
  );
}
