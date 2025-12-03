import React, { useState, useMemo } from 'react';
import { useCart } from '../CartContext';
import ProductModal from '../components/ProductModal';
import { motion } from 'framer-motion';

export default function CatalogPage({ products = [], loading, error }) {
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  function setQuantity(id, value) {
    setQuantities((q) => ({ ...q, [id]: Math.max(1, Number(value) || 1) }));
  }

  const placeholder = 'https://via.placeholder.com/400x300?text=No+Image';

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = q === '' || (p.name && p.name.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q));
    const matchesCat = category === 'All' || p.category === category;
    return matchesQuery && matchesCat;
  });

  function getProductImage(product) {
    return product.imageUrl || product.image || placeholder;
  }

  return (
    <div className="container page-fade">
      <h2>Catalog</h2>
      {loading && <p>Chargement…</p>}
      {error && <p className="error">{error}</p>}

      <div className="catalog-controls" style={{marginBottom:16}}>
        <input className="search-input" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="category-filters">
          {categories.map((c) => (
            <button key={c} className={`cat-btn ${category===c? 'active':''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      </div>

      <motion.div
        className="catalog-grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
      >
        {filtered.map((p, idx) => {
          const qty = quantities[p.id] || 1;
          return (
            <motion.article
              className="product-card"
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.28 } }
              }}
              whileHover={{ scale: 1.02 }}
              style={{ originY: 0.5 }}
              onClick={() => setSelected(p)}
            >
              <div className="product-image">
                <img src={getProductImage(p)} alt={p.name} />
              </div>
              <div className="product-body">
                <h3 className="product-title">{p.name}</h3>
                <p className="desc">{p.description}</p>
                <div className="product-meta">
                  <div className="price">{p.price} €</div>
                  <div className="stock">Stock: {p.stock != null ? p.stock : 'N/A'}</div>
                </div>
                <div className="product-actions">
                  <label className="qty-label">
                    Qty
                    <input className="qty-input" type="number" min="1" value={qty} onChange={(e) => setQuantity(p.id, e.target.value)} />
                  </label>
                  <button className="btn add-btn" onClick={(e) => { e.stopPropagation(); addToCart(p, qty); }}>Add to Cart</button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={(prod, qty) => { addToCart(prod, qty); setSelected(null); }} />
    </div>
  );
}
