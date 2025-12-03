import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useToast } from '../ToastContext';
import CheckoutSteps from '../components/CheckoutSteps';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });

  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    // Format card number: remove spaces, add spaces every 4 digits
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentData({ ...paymentData, [name]: formatted });
    }
    // Format expiry date: MM/YY format
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').slice(0, 4);
      if (formatted.length >= 2) {
        setPaymentData({ ...paymentData, [name]: `${formatted.slice(0, 2)}/${formatted.slice(2)}` });
      } else {
        setPaymentData({ ...paymentData, [name]: formatted });
      }
    }
    // Limit CVC to 3-4 digits
    else if (name === 'cvc') {
      setPaymentData({ ...paymentData, [name]: value.replace(/\D/g, '').slice(0, 4) });
    } else {
      setPaymentData({ ...paymentData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Billing & Shipping validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Nom complet requis';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email valide requis';
    }
    if (!formData.address.trim()) newErrors.address = 'Adresse requise';
    if (!formData.city.trim()) newErrors.city = 'Ville requise';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Code postal requis';

    // Payment validation
    const cardNum = paymentData.cardNumber.replace(/\s/g, '');
    if (!cardNum || cardNum.length !== 16) {
      newErrors.cardNumber = 'Numéro de carte invalide (16 chiffres)';
    }
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Format invalide (MM/YY)';
    }
    if (!paymentData.cvc || paymentData.cvc.length < 3) {
      newErrors.cvc = 'CVC invalide (3-4 chiffres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate payment success (no external payment call)
      // Clear cart, show toast, and redirect to confirmation
      clearCart();
      addToast('Paiement simulé avec succès. Merci pour votre commande !', 3000);
      navigate('/payment-confirmation');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-fade checkout-empty">
        <div className="empty-card">
          <h2>Panier vide</h2>
          <p>Veuillez ajouter des articles avant de procéder au paiement.</p>
          <button onClick={() => navigate('/catalog')} className="btn-primary">
            Retour au Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-fade checkout-page">
      <CheckoutSteps activeStep={2} />
      <h1>Checkout</h1>

      <form className="checkout-container" onSubmit={handlePayNow}>
        {/* Left: Forms */}
        <div className="checkout-forms">
          {/* Billing & Shipping Section */}
          <div className="form-section">
            <h2>Facturation & Livraison</h2>
              <div className="form-group">
                <label htmlFor="fullName">Nom complet*</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Jean Dupont"
                  className={errors.fullName ? 'input-error' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="jean.dupont@email.com"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Adresse*</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  placeholder="123 Rue de l'Exemple"
                  className={errors.address ? 'input-error' : ''}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Ville*</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="Paris"
                    className={errors.city ? 'input-error' : ''}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Code Postal*</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleFormChange}
                    placeholder="75001"
                    className={errors.postalCode ? 'input-error' : ''}
                  />
                  {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">Pays</label>
                <select id="country" name="country" value={formData.country} onChange={handleFormChange}>
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>Luxembourg</option>
                  <option>Canada</option>
                </select>
              </div>
          </div>

          {/* Payment Details Section */}
          <div className="form-section payment-section">
            <h2>Détails de Paiement</h2>
              <div className="form-group">
                <label htmlFor="cardNumber">Numéro de Carte*</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={errors.cardNumber ? 'input-error' : ''}
                />
                {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiration (MM/YY)*</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handlePaymentChange}
                    placeholder="12/26"
                    maxLength="5"
                    className={errors.expiryDate ? 'input-error' : ''}
                  />
                  {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="cvc">CVC*</label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    value={paymentData.cvc}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    maxLength="4"
                    className={errors.cvc ? 'input-error' : ''}
                  />
                  {errors.cvc && <span className="error-text">{errors.cvc}</span>}
                </div>
              </div>

              <p className="payment-notice">
                ℹ️ Ceci est une démonstration pédagogique. Aucune donnée sensible n'est stockée ni envoyée.
              </p>
          </div>
        </div>

        {/* Right: Order Summary */}
        <aside className="order-summary">
          <h2>Résumé de Commande</h2>

          <div className="summary-items">
            {cartItems.map((it) => (
              <div key={it.product.id} className="summary-item">
                <div className="summary-item-info">
                  <p className="summary-item-name">{it.product.name}</p>
                  <p className="summary-item-qty">Quantité: {it.quantity}</p>
                </div>
                <div className="summary-item-price">
                  €{((it.product.price || 0) * (it.quantity || 0)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-totals">
            <div className="summary-total-row">
              <span>Subtotal</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <div className="summary-total-row">
              <span>Shipping</span>
              <span className="shipping-free">Gratuit</span>
            </div>
            <div className="summary-total-row summary-grand-total">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" className="btn-pay-now">
            Payer Maintenant
          </button>

          <button onClick={() => navigate('/cart')} className="btn-back-to-cart">
            Retour au Panier
          </button>
        </aside>
      </form>
    </div>
  );
}
