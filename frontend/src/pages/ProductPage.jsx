import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

export default function ProductPage({ products = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2224%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E';

  const product = useMemo(() => {
    return products.find((p) => p.id === id);
  }, [products, id]);

  if (!product) {
    return (
      <div className="container page-fade">
        <p>Produit non trouvé.</p>
        <button className="btn" onClick={() => navigate('/catalog')}>Retour au catalogue</button>
      </div>
    );
  }

  function getProductImage() {
    return product.imageUrl || product.image || placeholder;
  }

  function handleImageError(e) {
    e.target.src = placeholder;
  }

  function handleAddToCart() {
    addToCart(product, 1);
    navigate('/cart');
  }

  return (
    <div className="container page-fade">
      <button className="btn-back" onClick={() => navigate(-1)}>← Retour</button>
      
      <div className="product-detail">
        <div className="product-detail-image">
          <img 
            src={getProductImage()} 
            alt={product.name} 
            onError={handleImageError}
          />
        </div>

        <div className="product-detail-content">
          <h1>{product.name}</h1>
          
          <div className="product-detail-meta">
            {product.category && (
              <span className="category-badge">{product.category}</span>
            )}
            <span className="stock-badge">
              Stock: {product.stock != null ? product.stock : 'N/A'}
            </span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-detail-price">
            <span className="price-label">Prix</span>
            <span className="price-value">{product.price} €</span>
          </div>

          <button 
            className="btn add-btn btn-large"
            onClick={handleAddToCart}
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
