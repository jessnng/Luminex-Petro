const { authProfileController } = require('../controllers/profile.js');
const request = require('supertest');
const client = require('../controllers/profile.js')

// Mock data for testing profile update
const profileMockData = {
    body: {
        fullname: 'John Doe',
        address1: '123 Main St',
        address2: 'Apt 101', // Optional field
        city: 'Anytown',
        state: 'NY',
        zipcode: '12345'
    }
};

// Test suite for profile update route
describe('Profile Update Route', () => {
    // Test case: Valid profile update
    it('should update profile successfully for existing user with valid data', async () => {
        const response = await request(client) // Assuming client is your Express app
            .post('/profile/username/update') // Replace 'username' with an existing username
            .send(profileMockData.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Profile updated successfully');
    });

    // Test case: Missing required fields
    it('should return 400 error if required fields are missing', async () => {
        const response = await request(client) // Assuming client is your Express app
            .post('/profile/username/update') // Replace 'username' with an existing username
            .send({}); // Send empty object to simulate missing fields
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Missing required fields');
    });

    // Test case: User not found
    it('should return 404 error if user does not exist', async () => {
        const response = await request(client) // Assuming client is your Express app
            .post('/profile/nonexistentuser/update') // Replace 'nonexistentuser' with a non-existing username
            .send(profileMockData.body);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'User not found');
    });

});
