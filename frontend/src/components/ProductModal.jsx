import React, { useEffect } from 'react';

export default function ProductModal({ product, onClose, onAdd }) {
  if (!product) return null;

  const placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2224%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E';
  const productImage = product.imageUrl || product.image || placeholder;

  function handleImageError(e) {
    e.target.src = placeholder;
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    // prevent body scroll while modal is open
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  function overlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={overlayClick}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={product.name}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-body">
          <div className="modal-image">
            <img src={productImage} alt={product.name} onError={handleImageError} />
          </div>
          <div className="modal-content">
            <h2>{product.name}</h2>
            <p className="desc">{product.description}</p>
            <p><strong>Category:</strong> {product.category || '—'}</p>
            <p><strong>Stock:</strong> {product.stock != null ? product.stock : 'N/A'}</p>
            <p className="price">{product.price} €</p>
            <div style={{marginTop:12}}>
              <button className="btn add-btn" onClick={() => onAdd(product, 1)}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
