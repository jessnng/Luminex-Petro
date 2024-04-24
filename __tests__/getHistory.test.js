const { getRateHistoryFactor } = require('../controllers/getHistory');
const { MongoClient } = require('mongodb');

// Mocking the Express request and response objects
const req = { 
    body: { username: 'testuser' } 
};
const res = {
  status: jest.fn(() => res),
  json: jest.fn(),
};

// Mock MongoDB client
jest.mock('mongodb', () => ({
  MongoClient: {
    connect: jest.fn(),
  },
}));

describe('getRateHistoryFactor', () => {
    it('should return an error if username is missing or not a string', async () => {
        const reqMissingUsername = { body: { username: undefined } };
        const reqNonStringUsername = { body: { username: 123 } };
      
        // Call the function with missing username
        await getRateHistoryFactor(null, reqMissingUsername, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or missing username' });
      
        // Call the function with non-string username
        await getRateHistoryFactor(null, reqNonStringUsername, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or missing username' });
      });
      
      it('should return 200 and rate history factor of 0.00 if user has no history', async () => {
        // Mocking an empty quote history
        const mockFind = jest.fn(() => ({
          toArray: jest.fn(() => []),
        }));
        const mockCollection = { find: mockFind };
        const mockDb = { collection: jest.fn(() => mockCollection) };
        const mockClient = { db: jest.fn(() => mockDb) };
      
        await getRateHistoryFactor(mockClient, req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ rateHistoryFactor: 0.00 });
      });
      
      it('should return 200 and rate history factor of 0.01 if user has history', async () => {
        // Mocking a non-empty quote history
        const mockFind = jest.fn(() => ({
          toArray: jest.fn(() => [{ /* mock quote history */ }]),
        }));
        const mockCollection = { find: mockFind };
        const mockDb = { collection: jest.fn(() => mockCollection) };
        const mockClient = { db: jest.fn(() => mockDb) };
      
        await getRateHistoryFactor(mockClient, req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ rateHistoryFactor: 0.01 });
      });

      it('should return an error 500 response when there is an error retrieving rate history factor', async () => {
        const mockFind = jest.fn(() => {
          throw new Error('Mock database error');
        });
        const mockCollection = { find: mockFind };
        const mockDb = { collection: jest.fn(() => mockCollection) };
        const mockClient = { db: jest.fn(() => mockDb) };
      
        await getRateHistoryFactor(mockClient, req, res);
        expect(console.error).toHaveBeenCalledWith('Error retrieving rate history factor:', expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving rate history factor' });
      });
      
      
});
