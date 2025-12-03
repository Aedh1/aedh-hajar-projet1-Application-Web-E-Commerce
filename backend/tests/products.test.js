const request = require('supertest');
const app = require('../app');

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return a 200 status code', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);
    });

    it('should return an array of products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return at least one product', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should have required fields in each product (id, name, price, description, imageUrl)', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      response.body.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('imageUrl');
      });
    });

    it('should have valid data types for product fields', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      response.body.forEach(product => {
        expect(typeof product.id).toBe('string');
        expect(typeof product.name).toBe('string');
        expect(typeof product.price).toBe('number');
        expect(typeof product.description).toBe('string');
        expect(typeof product.imageUrl).toBe('string');
      });
    });

    it('should have valid price values (greater than 0)', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      response.body.forEach(product => {
        expect(product.price).toBeGreaterThan(0);
      });
    });

    it('should return products with non-empty required fields', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      response.body.forEach(product => {
        expect(product.id.trim().length).toBeGreaterThan(0);
        expect(product.name.trim().length).toBeGreaterThan(0);
        expect(product.description.trim().length).toBeGreaterThan(0);
        expect(product.imageUrl.trim().length).toBeGreaterThan(0);
      });
    });

    it('should return Content-Type application/json', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/);
    });
  });
});
