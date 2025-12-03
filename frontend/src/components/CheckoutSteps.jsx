import React from 'react';
import { useLocation } from 'react-router-dom';

export default function CheckoutSteps({ activeStep: propActive }) {
  const location = useLocation();

  const steps = [
    { id: 1, label: 'Cart', path: '/cart' },
    { id: 2, label: 'Payment', path: '/checkout' },
    { id: 3, label: 'Confirmation', path: '/payment-confirmation' },
  ];

  const getActiveFromLocation = () => {
    if (location.pathname === '/cart') return 1;
    if (location.pathname === '/checkout') return 2;
    if (location.pathname === '/payment-confirmation') return 3;
    return 0;
  };

  const activeStep = typeof propActive === 'number' ? propActive : getActiveFromLocation();

  return (
    <div className="checkout-steps">
      <div className="steps-container">
        {steps.map((step, index) => {
          const isActive = activeStep === step.id;
          const isCompleted = activeStep > step.id;
          return (
            <React.Fragment key={step.id}>
              <div className="step-item">
                <div className={`step-circle ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}>
                  {isCompleted ? <span className="step-checkmark">✓</span> : <span className="step-number">{step.id}</span>}
                </div>
                <div className={`step-label ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}>
                  {step.label}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className={`step-connector ${isCompleted ? 'completed' : ''}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
