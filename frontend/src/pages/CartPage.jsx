import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { motion } from 'framer-motion';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal, total } = useCart();

  const placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22120%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22160%22 height=%22120%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E';

  function getItemImage(item) {
    return item.product?.imageUrl || item.product?.image || placeholder;
  }

  function handleImageError(e) {
    e.target.src = placeholder;
  }

  return (
    <div className="container page-fade">
      <CheckoutSteps activeStep={1} />
      <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>Shopping Cart</motion.h2>

      {(!cartItems || cartItems.length === 0) ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div className="cart-layout">
          <motion.div className="cart-list" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.32 }}>
            {cartItems.map((i) => (
              <motion.div className="cart-item" key={i.product.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
                <div className="cart-item-image">
                  <img src={getItemImage(i)} alt={i.product.name} onError={handleImageError} />
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-title">{i.product.name}</h3>
                  <p className="cart-item-desc">{i.product.description}</p>
                  <div className="cart-item-meta">
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <div className="cart-price">{i.product.price} €</div>
                      <div className="cart-qty">
                        <label style={{fontSize:'.9rem',color:'var(--muted)'}}>Qty</label>
                        <input type="number" min="1" value={i.quantity} onChange={(e) => updateQuantity(i.product.id, Number(e.target.value) || 1)} />
                        <button className="btn btn-remove" style={{marginLeft:8}} onClick={() => removeFromCart(i.product.id)}>Remove</button>
                      </div>
                    </div>

                    <div className="line-total">{( (i.product.price || 0) * (i.quantity || 0) ).toFixed(2)} €</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.aside className="order-summary" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.32 }}>
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>{subtotal.toFixed(2)} €</span></div>
            <div className="summary-row"><span>Shipping</span><span>Free</span></div>
            <div className="summary-total"><span>Total</span><span>{total.toFixed(2)} €</span></div>

            <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:10}}>
              <button className="btn btn-primary" style={{padding:'10px 12px'}} onClick={() => navigate('/checkout')}>Proceed to Payment</button>
              <button className="btn btn-secondary" style={{padding:'10px 12px'}} onClick={clearCart}>Clear Cart</button>
            </div>
          </motion.aside>
        </div>
      )}
    </div>
  );
}
