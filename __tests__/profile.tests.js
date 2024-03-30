const { updateProfileController } = require('../controllers/profile.js');
const request = require('supertest');
const client = require('../controllers/profile.js')

// Mock data for testing profile update
const profileMockData = {
    params: {
        username: 'testuser' // Replace with an existing username
    },
    body: {
        fullname: 'John Doe',
        address1: '123 Main St',
        address2: 'Apt 101', // Optional field
        city: 'Anytown',
        state: 'NY',
        zipcode: '12345'
    }
};

const mockResponse = {
    status: jest.fn().mockReturnThis(),
      json: jest.fn()
};

// Test suite for profile update route
describe('Profile Update Route', () => {
    // Test case: Valid profile update
    test('should update profile successfully for existing user with valid data', async () => {
        
        await updateProfileController(profileMockData,mockResponse);
        expect(profileMockData.status).toHaveBeenCalledWith(200);
        expect(profileMockData.json).toHaveBeenCalledWith({ message: 'Profile updated successfully' });
    });

    // Test case: Missing required fields
    it('should return 400 error if required fields are missing', async () => {
        // const response = await request(client) // Assuming client is your Express app
        //     .post('/profile/username/update') // Replace 'username' with an existing username
        //     .send({}); // Send empty object to simulate missing fields
        const invalidRequest = { ...profileMockData, body: {} }; // Simulate missing fields
        await updateProfileController(invalidRequest, mockResponse);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.body).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });

    // Test case: User not found
    it('should return 404 error if user does not exist', async () => {
        // const response = await request(client) // Assuming client is your Express app
        //     .post('/profile/nonexistentuser/update') // Replace 'nonexistentuser' with a non-existing username
        //     .send(profileMockData.body);
        const nonExistingUserRequest = { ...profileMockData, params: { username: 'nonexistentuser' } }; // Simulate non-existing user
        await updateProfileController(nonExistingUserRequest, mockResponse);
        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.body).toHaveBeenCalledWith({ error: 'User not found' });
    });

});
