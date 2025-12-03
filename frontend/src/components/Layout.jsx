import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../CartContext';

export default function Layout({ children }) {
  const { cartItems } = useCart();
  const cartCount = cartItems ? cartItems.reduce((s, i) => s + (i.quantity || 0), 0) : 0;

  return (
    <div>
      <header className="header">
        <div className="logo">Futurist Design Store</div>
        <nav className="nav">
          <NavLink to="/" className="nav-item" end>
            Catalog
          </NavLink>
          <NavLink to="/about" className="nav-item">
            About
          </NavLink>
          <NavLink to="/cart" className="nav-item cart-link">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
        </nav>
      </header>

      <main>
        {children}
      </main>

      <footer className="footer">© {new Date().getFullYear()} Futurist Design Store. All rights reserved.</footer>
    </div>
  );
}
