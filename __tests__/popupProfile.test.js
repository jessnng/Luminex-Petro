const { popupProfileController } = require('../controllers/popupProfile.js');
const { MongoClient } = require('mongodb');

jest.mock('mongodb');

describe('popupProfileController', () => {
    let client, req, res;

    beforeAll(async () => {
        MongoClient.mockImplementation(() => ({
            connect: jest.fn(),
            db: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnThis(),
                updateOne: jest.fn().mockResolvedValue({})
            })
        }));
        client = new MongoClient();
        await client.connect();
    });

    afterAll(async () => {
        await client.close();
    });

    beforeEach(() => {
        req = {
            body: {
                fullname: 'John Doe',
                address1: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipcode: '10001',
                username: 'johndoe'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return successful if user updates with all fields', async () => {
        client.db().collection().updateOne.mockResolvedValueOnce({});
        await popupProfileController(client, req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User profile updated successfully' });
    });

    it('should return successful if user updates with only provided fields', async () => {
        req.body = {
            fullname: 'John Doe'
        };
    
        // Mock the update operation to resolve successfully
        client.db().collection().updateOne.mockResolvedValueOnce({});
    
        // Call the controller function
        await popupProfileController(client, req, res);
    
        // Expect the status to be 200
        expect(res.status).toHaveBeenCalledWith(200);
        // Expect the response message to indicate successful update
        expect(res.json).toHaveBeenCalledWith({ message: 'User profile updated successfully' });
    
        // Check that the updateOne method was called with the correct update fields
        expect(client.db().collection().updateOne).toHaveBeenCalledWith(
            { username: req.body.username }, // Expect the username to be used as a filter
            { $set: { fullname: req.body.fullname } } // Expect only the provided field to be updated
        );
    });
    

    it('should return 500 with unexpected errors', async () => {
        const mockClient = {
            db: jest.fn().mockReturnThis(),
            collection: jest.fn().mockReturnThis(),
            updateOne: jest.fn().mockRejectedValue(new Error('Mocked database error'))
        };
    
        await popupProfileController(mockClient, req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while updating user profile' });
    });
});
