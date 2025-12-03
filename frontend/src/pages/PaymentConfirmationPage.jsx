import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

export default function PaymentConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="page-fade confirmation-page">
      <CheckoutSteps activeStep={3} />
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1>Paiement Simulé avec Succès!</h1>
          <p className="confirmation-message">
            Merci pour votre commande. Votre paiement a été traité avec succès.
          </p>

          <div className="confirmation-details">
            <p>
              Un email de confirmation a été envoyé à votre adresse email. 
              Vous pouvez suivre votre commande dans votre compte.
            </p>
            <p className="demo-notice">
              ℹ️ <strong>Note:</strong> Ceci est une démonstration pédagogique. 
              Aucune donnée de paiement n'a été traitée ni stockée.
            </p>
          </div>

          <div className="confirmation-actions">
            <button onClick={() => navigate('/catalog')} className="btn-primary">
              Continuer vos Achats
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Retour à l'Accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
