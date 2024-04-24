// Import the module to test
const dbManager = require('../controllers/databaseManager');

// Mock the MongoClient behavior
jest.mock('mongodb');
const { MongoClient } = require('mongodb');

describe('DatabaseManager', () => {
  afterEach(() => {
    // Reset mocked behavior after each test
    jest.clearAllMocks();
  });

  it('should connect to MongoDB when connect() is called', async () => {
    // Mock MongoClient instance and its connect method
    const mockConnect = jest.fn();
    MongoClient.mockImplementation(() => ({
      connect: mockConnect
    }));

    // Call the connect() method
    await dbManager.connect();

    // Expect MongoClient to be called with the provided URI
    expect(MongoClient).toHaveBeenCalledWith(dbManager.uri);

  });

  it('should return the MongoClient instance when getClient() is called', () => {

    // Call getClient() method
    const client = dbManager.getClient();

    // Expect the returned client to be the same as the client property of the instance
    expect(client).toBe(dbManager.client);
  });
});
