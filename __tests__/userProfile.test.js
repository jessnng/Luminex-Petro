const { userProfileController } = require('../controllers/userProfile.js');
const dbManager = require('../controllers/databaseManager');

// Mock MongoDB client and collection
const mockCollection = {
    findOne: jest.fn()
  };
  
  const mockClient = {
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection)
    })
  };

jests.mock('../controllers/databaseManager');

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
      mockCollection.findOne.mockResolvedValue(mockUserProfile);
  
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
      mockCollection.findOne.mockResolvedValue(null);
  
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
      mockCollection.findOne.mockRejectedValue(new Error('Internal server error'));
  
      // Call the controller function
      await userProfileController(mockClient, req, res);
  
      // Expectations
      expect(mockCollection.findOne).toHaveBeenCalledWith({ username: 'testUser' });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
