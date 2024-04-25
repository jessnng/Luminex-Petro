  const request = require('supertest');
  const express = require('express');
  const { userProfileController } = require('../controllers/userProfile');
  const dbManager = require('../controllers/databaseManager');
  
  // Mocking the database manager
  jest.mock('../controllers/databaseManager');
  
  const app = express();
  
  // Create a simple route for testing
  app.get('/user-profile', userProfileController);
  
  describe('userProfileController', () => {
    beforeEach(() => {
      // Reset all mocks before each test
      jest.resetAllMocks();
    });
  
    test('should return 400 if username parameter is missing', async () => {
      const response = await request(app).get('/user-profile');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing username parameter');
    });
  
    test('should return 404 if user profile not found', async () => {
      const mockClient = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            findOne: jest.fn().mockResolvedValue(null), // User not found
          }),
        }),
      };
  
      dbManager.getClient.mockReturnValue(mockClient);
  
      const response = await request(app).get('/user-profile?username=unknownUser');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User profile not found');
    });
  
    test('should return 200 if user profile is retrieved successfully', async () => {
      const userProfile = {
        username: 'john_doe',
        name: 'John Doe',
        email: 'john@example.com',
      };
  
      const mockClient = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            findOne: jest.fn().mockResolvedValue(userProfile),
          }),
        }),
      };
  
      dbManager.getClient.mockReturnValue(mockClient);
  
      const response = await request(app).get('/user-profile?username=john_doe');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(userProfile);
    });
  
    test('should return 500 if an internal server error occurs', async () => {
      dbManager.connect.mockRejectedValue(new Error('Database connection error'));
  
      const response = await request(app).get('/user-profile?username=john_doe');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });
