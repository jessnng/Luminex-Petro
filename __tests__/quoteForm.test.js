const request = require('supertest');
const express = require('express');
const { quoteFormController } = require('../controllers/quoteForm');
const dbManager = require('../controllers/databaseManager');

// Mock the database manager
jest.mock('../controllers/databaseManager');

const app = express();
app.use(express.json());

// Set up the route for testing
app.post('/quote-form', quoteFormController);

describe('quoteFormController', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Reset mocks before each test
  });

  test('should return 400 if gallonsRequest is missing', async () => {
    const response = await request(app).post('/quote-form').send({
      username: 'test_user',
      deliveryAddress: { address1: '123 Main St', city: 'Test City', state: 'TS', zipcode: '12345' },
      deliveryDate: '2024-05-01',
      suggestedPrice: 1.99,
      amountDue: 100.0,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("A value is needed for gallons requested.");
  });

  test('should insert quote form successfully and return 200', async () => {
    const mockClient = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn().mockResolvedValue({ insertedId: 'test_id' }),
        }),
      }),
    };

    dbManager.getClient.mockReturnValue(mockClient);

    const response = await request(app).post('/quote-form').send({
      username: 'test_user',
      gallonsRequest: 500,
      deliveryAddress: { address1: '123 Main St', city: 'Test City', state: 'TS', zipcode: '12345' },
      deliveryDate: '2024-05-01',
      suggestedPrice: 1.99,
      amountDue: 100.0,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Quote form successfully submitted.');
  });

  test('should return 500 if an internal server error occurs', async () => {
    dbManager.connect.mockRejectedValue(new Error('Database connection error'));

    const response = await request(app).post('/quote-form').send({
      username: 'test_user',
      gallonsRequest: 500,
      deliveryAddress: { address1: '123 Main St', city: 'Test City', state: 'TS', zipcode: '12345' },
      deliveryDate: '2024-05-01',
      suggestedPrice: 1.99,
      amountDue: 100.0,
    });

    expect(response.status).toBe(500);
    expect(response.body).toBe('Internal server error.');
  });
});
    