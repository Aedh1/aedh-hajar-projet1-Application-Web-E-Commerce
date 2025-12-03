import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import { CartProvider } from './CartContext';
import { ToastProvider } from './ToastContext';

const root = createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<ToastProvider>
			<CartProvider>
				<App />
			</CartProvider>
		</ToastProvider>
	</BrowserRouter>
);
