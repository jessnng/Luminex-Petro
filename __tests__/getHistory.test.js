const { getRateHistoryFactor } = require('../controllers/getHistory');
const { MongoClient } = require('mongodb');

// Mock MongoDB client
jest.mock('mongodb', () => ({
  MongoClient: {
    db: jest.fn(),
  },
}));

describe('getRateHistoryFactor', () => {
  let mockClient, mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn(),
    };
    mockClient = {
      db: jest.fn(() => ({
        collection: jest.fn(() => mockCollection),
      })),
    };
  });

  it('should throw an error if username is missing or not a string', async () => {
    await expect(getRateHistoryFactor(mockClient, undefined)).rejects.toThrow('Invalid or missing username');
    await expect(getRateHistoryFactor(mockClient, 123)).rejects.toThrow('Invalid or missing username');
  });

  it('should return rate history factor 0.00 if user has no history', async () => {
    mockCollection.find.mockReturnValueOnce({ toArray: jest.fn(() => []) });

    const factor = await getRateHistoryFactor(mockClient, 'testuser');
    expect(factor).toEqual(0.00);
  });

  it('should return rate history factor 0.01 if user has history', async () => {
    mockCollection.find.mockReturnValueOnce({ toArray: jest.fn(() => [/* mock quote history */]) });

    const factor = await getRateHistoryFactor(mockClient, 'testuser');
    expect(factor).toEqual(0.01);
  });

  it('should throw an error if there is an error retrieving rate history factor', async () => {
    mockCollection.find.mockImplementationOnce(() => {
      throw new Error('Mock database error');
    });

    await expect(getRateHistoryFactor(mockClient, 'testuser')).rejects.toThrow('Error retrieving rate history factor');
  });
});

