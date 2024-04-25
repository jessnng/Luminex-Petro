const request = require('supertest');
const express = require('express');
const { quoteHistoryController } = require('../controllers/quoteHistory');
const dbManager = require('../controllers/databaseManager');
const { getRateHistoryFactor } = require('../controllers/getHistory');

// Mock the necessary dependencies
jest.mock('../controllers/databaseManager');
jest.mock('../controllers/getHistory', () => ({
  getRateHistoryFactor: jest.fn(),
}));

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Setup the testing route
app.get('/quote-history', quoteHistoryController);

describe('quoteHistoryController', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Reset mocks before each test
  });

  test('should return 401 if authorization header is missing', async () => {
    const response = await request(app).get('/quote-history');
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized'); // Note that error is case-sensitive
  });

  test('should return 401 if authorization header does not start with "Basic "', async () => {
    const response = await request(app).get('/quote-history').set('Authorization', 'Bearer token');
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  test('should return 401 if username is missing in authorization', async () => {
    const response = await request(app).get('/quote-history').set('Authorization', 'Basic Og=='); // No username
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  test('should return 200 with empty quote history and rateHistoryFactor 0.0', async () => {
    const mockClient = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
        }),
      }),
    };

    dbManager.getClient.mockReturnValue(mockClient);
    getRateHistoryFactor.mockResolvedValue(0.0);

    const response = await request(app).get('/quote-history').set('Authorization', 'Basic dGVzdF91c2VyOg=='); // "test_user:"

    expect(response.status).toBe(200);
    expect(response.body.rateHistoryFactor).toBe(0.0);
    expect(response.body.history).toEqual([]);
  });

  test('should return 200 with valid quote history and rateHistoryFactor', async () => {
    const quoteHistory = [
      { quoteId: '1', gallonsRequest: 100, deliveryDate: '2023-01-01' },
      { quoteId: '2', gallonsRequest: 200, deliveryDate: '2023-02-01' },
    ];

    const mockClient = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue(quoteHistory) }),
        }),
      }),
    };

    dbManager.getClient.mockReturnValue(mockClient);
    getRateHistoryFactor.mockResolvedValue(1.5);

    const response = await request(app)
      .get('/quote-history')
      .set('Authorization', 'Basic dGVzdF91c2VyOg=='); // "test_user:"

    expect(response.status).toBe(200);
    expect(response.body.rateHistoryFactor).toBe(1.5);
    expect(response.body.history).toEqual(quoteHistory);
  });

  test('should return 500 if a database connection error occurs', async () => {
    dbManager.getClient.mockRejectedValue(new Error('Database connection error'));

    const response = await request(app)
      .get('/quote-history')
      .set('Authorization', 'Basic dGVzdF91c2VyOg=='); // "test_user:"

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});

describe('DatabaseManager', () => {
  // Test for successful connection
  it('should connect to the database successfully', async () => {
    // Mock the MongoClient and simulate successful connection
    const client = {
      connect: jest.fn().mockResolvedValue()
    };

    // Mock the DatabaseManager
    const dbManager = new DatabaseManager('mock-uri');
    dbManager.client = client;

    // Call the connect method and assert the connection
    await dbManager.connect();
    expect(client.connect).toHaveBeenCalled();
  });

  // Test for connection error
  it('should throw an error if connection to the database fails', async () => {
    // Mock the MongoClient and simulate connection error
    const client = {
      connect: jest.fn().mockRejectedValue(new Error('Connection error'))
    };

    // Mock the DatabaseManager
    const dbManager = new DatabaseManager('mock-uri');
    dbManager.client = client;

    // Call the connect method and assert the thrown error
    await expect(dbManager.connect()).rejects.toThrow('Connection error');
  });

  // Test for getClient method
  it('should return the MongoDB client', () => {
    // Mock the MongoClient
    const client = {};

    // Mock the DatabaseManager
    const dbManager = new DatabaseManager('mock-uri');
    dbManager.client = client;

    // Call the getClient method and assert the returned client
    expect(dbManager.getClient()).toEqual(client);
  });
});
