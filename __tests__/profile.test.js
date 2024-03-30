const { updateProfileController } = require('../controllers/profile.js');
const { MongoClient } = require('mongodb');


jest.mock('mongodb');

describe('updateProfileController', () => {
    let req, res;

    beforeEach(() => {
        // Mock request and response objects
        req = {
            params: { username: 'testuser' },
            body: {
                fullname: 'John Doe',
                address1: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                zipcode: '12345'
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        // Modify request to have missing required fields
        delete req.body.fullname;

        await updateProfileController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });

    it('should return 404 if user does not exist', async () => {
        // Mock findOne to return null (user does not exist)
        const findOneMock = jest.fn().mockResolvedValueOnce(null);
        const collectionMock = { findOne: findOneMock };
        const dbMock = { collection: jest.fn().mockReturnValueOnce(collectionMock) };
        const clientMock = { db: jest.fn().mockReturnValueOnce(dbMock) };

        // Mock MongoClient.connect method to return clientMock
        MongoClient.connect.mockResolvedValueOnce(clientMock);

        await updateProfileController(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should update user profile successfully', async () => {
        // Mock updateOne to return modifiedCount = 1
        const updateOneMock = jest.fn().mockResolvedValueOnce({ modifiedCount: 1 });
        const collectionMock = { findOne: jest.fn().mockResolvedValueOnce({}), updateOne: updateOneMock };
        const dbMock = { collection: jest.fn().mockReturnValueOnce(collectionMock) };
        const clientMock = { db: jest.fn().mockReturnValueOnce(dbMock) };

        // Mock MongoClient.connect method to return clientMock
        MongoClient.connect.mockResolvedValueOnce(clientMock);

        await updateProfileController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Profile updated successfully' });
    });

    it('should return 500 if failed to update profile', async () => {
        // Mock updateOne to return modifiedCount = 0
        const updateOneMock = jest.fn().mockResolvedValueOnce({ modifiedCount: 0 });
        const collectionMock = { findOne: jest.fn().mockResolvedValueOnce({}), updateOne: updateOneMock };
        const dbMock = { collection: jest.fn().mockReturnValueOnce(collectionMock) };
        const clientMock = { db: jest.fn().mockReturnValueOnce(dbMock) };

        // Mock MongoClient.connect method to return clientMock
        MongoClient.connect.mockResolvedValueOnce(clientMock);

        await updateProfileController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update profile' });
    });

    it('should handle internal server error', async () => {
        // Mock MongoClient.connect to throw an error
        MongoClient.connect.mockRejectedValueOnce(new Error('Connection error'));

        await updateProfileController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
