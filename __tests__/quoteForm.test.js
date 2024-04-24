// Import required modules and functions
const { quoteFormController } = require('../controllers/quoteForm');
const { MongoClient } = require('mongodb');

jest.mock('mongodb');

describe('quoteFormController', () => {
    let req, res;

    beforeEach(() => {
        // Mock request and response objects
        req = {
            body: {
                username: 'testuser',
                gallonsRequest: 100, // Example value
                deliveryAddress: {
                    address1: '123 Example St',
                    address2: 'Apt 101',
                    city: 'City',
                    state: 'State',
                    zipcode: '12345'
                },
                deliveryDate: '2024-04-01',
                suggestedPrice: 10,
                amountDue: 100
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

    it('should return 400 if gallonsRequest is missing', async () => {
        // Modify request to have missing gallonsRequest
        delete req.body.gallonsRequest;

        await quoteFormController({}, req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "A value is needed for gallons requested." });
    });

    it('should successfully submit quote form', async () => {

        // Mock insertOne method of the collection
        const insertOneMock = jest.fn().mockResolvedValueOnce();
        const collectionMock = { insertOne: insertOneMock };
        
        // Mock client.db().collection() method
        const collectionFnMock = jest.fn().mockReturnValueOnce(collectionMock);
        const dbMock = { collection: collectionFnMock };
        const clientMock = { db: jest.fn().mockReturnValueOnce(dbMock) };

        // Mock MongoClient.connect method to return clientMock
        MongoClient.connect.mockResolvedValueOnce(clientMock);

        await quoteFormController(clientMock, req, res);

        expect(insertOneMock).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Quote form successfully submitted.' });
    });

    it('should return 500 if an internal server error occurs', async () => {
        const errorMessage = 'Internal server error occurred.';
        const clientMock = {
            db: jest.fn().mockImplementation(() => {
                throw new Error(errorMessage);
            })
        };

        await quoteFormController(clientMock, req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith("Internal server error.");
    });
    
});