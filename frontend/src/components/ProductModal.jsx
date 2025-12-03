import React, { useEffect } from 'react';

export default function ProductModal({ product, onClose, onAdd }) {
  if (!product) return null;

  const placeholder = 'https://via.placeholder.com/400x300?text=No+Image';
  const productImage = product.imageUrl || product.image || placeholder;

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
            <img src={productImage} alt={product.name} />
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
