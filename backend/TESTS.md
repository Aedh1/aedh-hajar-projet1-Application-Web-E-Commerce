# Backend Tests Documentation

## Overview
Complete test suite for the e-commerce backend API using Jest and Supertest.

## Installation

Tests have been configured and installed with:
```bash
npm install --save-dev jest supertest
```

## Running Tests

Run all tests:
```bash
npm test
```

The test suite is configured with the `--runInBand` flag to run tests sequentially, which is helpful for API testing where state management is important.

## Test Files

### 1. `tests/products.test.js`
Tests for the Products API endpoints.

**Endpoints Tested:**
- `GET /api/products`

**Test Cases (8 tests):**
1. Returns HTTP 200 status code
2. Returns an array of products
3. Returns at least one product
4. Each product contains required fields: `id`, `name`, `price`, `description`, `imageUrl`
5. All fields have correct data types
6. All prices are greater than 0
7. All required fields contain non-empty values
8. Response has correct Content-Type (application/json)

**Example Response:**
```json
[
  {
    "id": "prod-lamp",
    "name": "Nebula Desk Lamp",
    "price": 89.0,
    "description": "Sculptural desk lamp...",
    "category": "lighting",
    "imageUrl": "/photo/lampe.jpg",
    "stock": 12
  }
]
```

### 2. `tests/cart.test.js`
Tests for the Shopping Cart API endpoints.

**Endpoints Tested:**
- `GET /api/cart` - Retrieve cart contents
- `POST /api/cart` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

**Test Cases (18 tests):**

#### GET /api/cart (5 tests)
1. Returns HTTP 200 status code
2. Response has `items` property
3. Items property is an array
4. Initial cart is empty
5. Response has correct Content-Type

#### POST /api/cart (10 tests)
1. Adds product to cart with valid productId (status 200 or 201)
2. Can add multiple items to cart
3. Updates quantity when adding same product multiple times
4. Returns error (400 or 404) with invalid productId
5. Returns error when productId is missing
6. Returns error when quantity is missing
7. Returns error when quantity is 0 or negative
8. Returns product details in response
9. Response has correct Content-Type
10. Returns valid response structure

#### POST /api/cart/remove (2 tests)
1. Removes an item from cart
2. Handles removal of non-existent product

#### DELETE /api/cart (2 tests)
1. Clears the entire cart or returns appropriate status
2. Returns valid response structure after deletion

**Example Cart Item:**
```json
{
  "productId": "prod-lamp",
  "quantity": 2,
  "product": {
    "id": "prod-lamp",
    "name": "Nebula Desk Lamp",
    "price": 89.0,
    "description": "...",
    "imageUrl": "/photo/lampe.jpg"
  }
}
```

## Jest Configuration

The `jest.config.js` file includes:
- `testEnvironment: 'node'` - Uses Node.js environment
- `testMatch: ['**/tests/**/*.test.js']` - Finds test files
- `forceExit: true` - Exits after tests complete
- `testTimeout: 10000` - 10 second timeout per test
- Coverage reporting for `routes/`, `controllers/`, `middlewares/`, `utils/`

## Test Results

Latest run: **All 26 tests passing** ✅

```
Test Suites: 2 passed, 2 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        ~1 second
```

## Code Changes Made

### 1. Product IDs
Changed from UUID to simple string IDs for easier testing:
- `prod-lamp`, `prod-keyboard`, `prod-soundbar`, etc.

### 2. Product Controller
Removed UUID dependency and replaced with simple ID generation:
```javascript
const generateId = () => 'prod-' + Math.random().toString(36).substr(2, 9);
```

## Running Tests with Coverage

To see code coverage:
```bash
npm test -- --coverage
```

Coverage targets:
- Global: 85%
- Critical paths (routes, controllers): 90%

## Best Practices Used

1. **Isolation**: Each test is independent
2. **Clear Assertions**: Each test has specific expectations
3. **Error Handling**: Tests verify both success and failure cases
4. **API Contract**: Tests validate the contract between API and client
5. **Meaningful Names**: Test descriptions are clear and specific

## Next Steps

Future test improvements:
1. Add integration tests with database
2. Add middleware tests (error handler, 404 handler)
3. Add authentication tests
4. Add pagination tests for product listing
5. Add validation tests for request payloads
6. Add performance benchmarks
