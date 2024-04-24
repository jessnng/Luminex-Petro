const { userProfileController } = require('../controllers/userProfile');
const { DatabaseManager } = require('../controllers/databaseManager');

jest.mock('../controllers/databaseManager');

// Mock MongoDB client and collection
const mockCollection = {
  findOne: jest.fn()
};

const mockClient = {
  db: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue(mockCollection)
  })
};



describe('User Profile Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user profile when username exists', async () => {
    // Mock request and response objects
    const req = { query: { username: 'existingUser' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock user profile data
    const mockUserProfile = { username: 'existingUser', fullName: 'John Doe' };
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(mockUserProfile)
    };
    DatabaseManager.getClient.mockReturnValue({ db: jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue(mockCollection) }) });

    // Call the controller function
    await userProfileController(mockClient, req, res);

    // Expectations
    expect(mockCollection.findOne).toHaveBeenCalledWith({ username: 'existingUser' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User profile retrieved successfully', userProfile: mockUserProfile });
  });

  it('should return 404 error when user profile is not found', async () => {
    // Mock request and response objects
    const req = { query: { username: 'nonExistingUser' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock user profile data not found
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(null)
    };

    DatabaseManager.getClient.mockReturnValue({ db: jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue(mockCollection) }) });


    // Call the controller function
    await userProfileController(mockClient, req, res);

    // Expectations
    expect(mockCollection.findOne).toHaveBeenCalledWith({ username: 'nonExistingUser' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User profile not found' });
  });

  it('should return 400 error when username parameter is missing', async () => {
    // Mock request and response objects
    const req = { query: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Call the controller function
    await userProfileController(mockClient, req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing username parameter' });
  });

  it('should return 500 error when an internal server error occurs', async () => {
    // Mock request and response objects
    const req = { query: { username: 'testUser' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock internal server error
    const mockCollection = {
      findOne: jest.fn().mockRejectedValue(new Error('Internal server error'))
    };

    DatabaseManager.getClient.mockReturnValue({ db: jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue(mockCollection) }) });

    // Call the controller function
    await userProfileController(mockClient, req, res);

    // Expectations
    expect(mockCollection.findOne).toHaveBeenCalledWith({ username: 'testUser' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('Database Manager', () => {
  let dbManager;

  beforeEach(() => {
    dbManager = new DatabaseManager('mongodb://localhost:27017/test');
  });

  afterEach(async () => {
    await dbManager.close(); // Assuming you have a close method to close the connection
  });

  it('should connect to MongoDB successfully', async () => {
    await expect(dbManager.connect()).resolves.not.toThrow();
  });

  it('should handle connection errors', async () => {
    const invalidDbManager = new DatabaseManager('invalid-uri');

    await expect(invalidDbManager.connect()).rejects.toThrowError();
  });

  it('should return the same client instance as a singleton', () => {
    const client1 = dbManager.getClient();
    const client2 = dbManager.getClient();

    expect(client1).toBe(client2);
  });

});
