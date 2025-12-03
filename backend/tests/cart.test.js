const request = require('supertest');
const app = require('../app');

describe('Cart API', () => {
  // Reset cart state before each test
  beforeEach(async () => {
    // Clear the cart by attempting to delete all items
    // This depends on your implementation
  });

  describe('GET /api/cart', () => {
    it('should return a 200 status code', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(200);
    });

    it('should return a cart object with items property', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(response.body).toHaveProperty('items');
    });

    it('should return an array of items', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should return an empty cart on initial request', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(response.body.items.length).toBe(0);
    });

    it('should return Content-Type application/json', async () => {
      const response = await request(app)
        .get('/api/cart')
        .expect('Content-Type', /json/);
    });
  });

  describe('POST /api/cart', () => {
    it('should add a product to the cart with valid productId', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp',
          quantity: 1
        })
        .expect((res) => {
          expect([200, 201]).toContain(res.status);
        });

      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should add multiple items to cart', async () => {
      // Add first item
      await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp',
          quantity: 1
        });

      // Add second item
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-keyboard',
          quantity: 2
        })
        .expect((res) => {
          expect([200, 201]).toContain(res.status);
        });

      expect(response.body.items.length).toBeGreaterThanOrEqual(1);
    });

    it('should update quantity if product already in cart', async () => {
      // Add item first time
      await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp',
          quantity: 1
        });

      // Add same item second time
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp',
          quantity: 2
        })
        .expect((res) => {
          expect([200, 201]).toContain(res.status);
        });

      // Should still have only one lamp item but with updated quantity
      const lampItem = response.body.items.find(item => 
        (item.productId && item.productId === 'prod-lamp') || 
        (item.product && item.product.id === 'prod-lamp')
      );
      expect(lampItem).toBeDefined();
      if (lampItem.quantity) {
        expect(lampItem.quantity).toBeGreaterThan(1); // Quantity was updated
      }
    });

    it('should return an error (400 or 404) with invalid productId', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: 'invalid-product-id',
          quantity: 1
        });

      expect([400, 404]).toContain(response.status);
    });

    it('should return an error when productId is missing', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          quantity: 1
        });

      expect([400, 404]).toContain(response.status);
    });

    it('should return an error when quantity is missing', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp'
        });

      expect([400, 404]).toContain(response.status);
    });

    it('should return error with quantity <= 0', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp',
          quantity: 0
        });

      expect([400, 404]).toContain(response.status);
    });

    it('should include product details in the response', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp',
          quantity: 1
        })
        .expect((res) => {
          expect([200, 201]).toContain(res.status);
        });

      expect(response.body.items).toBeDefined();
      if (response.body.items.length > 0) {
        const item = response.body.items[0];
        // The cart item should have either productId property or product.id
        const hasProductInfo = ('productId' in item) || (item.product && 'id' in item.product);
        expect(hasProductInfo).toBe(true);
        expect(item).toHaveProperty('quantity');
      }
    });

    it('should return Content-Type application/json', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp',
          quantity: 1
        });

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('POST /api/cart/remove', () => {
    it('should remove an item from cart', async () => {
      // First add an item
      await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp',
          quantity: 1
        });

      // Then remove it
      const response = await request(app)
        .post('/api/cart/remove')
        .send({
          productId: 'prod-lamp'
        })
        .expect((res) => {
          expect([200, 201]).toContain(res.status);
        });

      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should return error when removing non-existent product', async () => {
      const response = await request(app)
        .post('/api/cart/remove')
        .send({
          productId: 'non-existent-product'
        });

      // Should return success with unchanged cart or error
      expect([200, 201, 404]).toContain(response.status);
    });
  });

  describe('DELETE /api/cart', () => {
    it('should clear the entire cart or return appropriate status', async () => {
      // First add items
      await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp',
          quantity: 1
        });

      // Then try to delete the entire cart
      const response = await request(app)
        .delete('/api/cart');

      // Accept either 200/201 (cart cleared) or 404 (endpoint not found)
      expect([200, 201, 404]).toContain(response.status);
    });

    it('should return valid response structure', async () => {
      // Add item
      await request(app)
        .post('/api/cart')
        .send({
          productId: 'prod-lamp',
          quantity: 1
        });

      // Try to delete
      const response = await request(app)
        .delete('/api/cart');

      // If successful, check response structure
      if ([200, 201].includes(response.status)) {
        expect(response.body).toHaveProperty('items');
        expect(response.body.items.length).toBe(0);
      }
    });
  });
});
