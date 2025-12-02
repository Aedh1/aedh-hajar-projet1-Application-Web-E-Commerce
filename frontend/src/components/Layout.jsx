import React from 'react';

export default function Layout({ children, cartCount = 0 }) {
  return (
    <div>
      <header className="header">
        <div className="logo">Aedh Boutique</div>
        <nav className="nav">
          <div className="nav-item">Produits</div>
          <div className="nav-item">À propos</div>
        </nav>
        <div className="cart">Panier ({cartCount})</div>
      </header>

      <main>
        {children}
      </main>

      <footer className="footer">© {new Date().getFullYear()} Aedh Boutique</footer>
    </div>
  );
}
