import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const productsMock = [
  { id: 'p1', name: 'T-shirt', price: 19.99, description: 'Coton' },
  { id: 'p2', name: 'Jeans', price: 49.99, description: 'Denim' }
];

beforeEach(() => {
  global.fetch = jest.fn((url, opts) => {
    if (url.endsWith('/api/products')) {
      return Promise.resolve({ ok: true, json: async () => productsMock });
    }
    if (url.endsWith('/api/cart')) {
      return Promise.resolve({ ok: true, json: async () => ({ items: [] }) });
    }
    if (url.endsWith('/api/cart/add')) {
      // return cart with one item for simplicity
      return Promise.resolve({ ok: true, json: async () => ({ items: [{ product: productsMock[0], quantity: 1 }] }) });
    }
    return Promise.resolve({ ok: false });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test('affiche la liste de produits', async () => {
  render(<App />);

  // wait for at least one product name to appear
  expect(await screen.findByText('T-shirt')).toBeInTheDocument();
  expect(screen.getByText('Jeans')).toBeInTheDocument();
});

test("l'ajout au panier met à jour le compteur", async () => {
  render(<App />);

  // wait products to load
  await screen.findByText('T-shirt');

  const addButtons = screen.getAllByText('Ajouter');
  expect(addButtons.length).toBeGreaterThan(0);

  // click first add button
  await userEvent.click(addButtons[0]);

  // after click, the header should display Panier (1)
  await waitFor(() => expect(screen.getByText(/Panier \(1\)/)).toBeInTheDocument());
});
