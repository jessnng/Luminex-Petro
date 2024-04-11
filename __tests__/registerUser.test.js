const { authRegisterController } = require('../controllers/registerUser.js');

  const mockDBClient = {
  db: () => ({
    collection: () => ({
      findOne: jest.fn(),
      insertOne: jest.fn(),
    }),
  }),
};

const mockData = {
    body: {
        username: 'username1',
        password: 'password1'
    },
};

const mockDataMissingFields = {
    body: {
        // Missing both username and password
    },
};

const mockRespond = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x),
};

// Register User - POST request
describe('POST, /register - create new user', () => {

    it ('should send status 400 when missing username and/or password', async () => {
        await authRegisterController(mockDBClient, mockDataMissingFields, mockRespond);
        expect(mockRespond.status).toHaveBeenCalledWith(400);
        expect(mockRespond.json).toHaveReturnedWith({ error: 'Missing required fields' });
    });

    it ('should send a status 400 when user exits', async () => {

        await authRegisterController(mockDBClient, mockData, mockRespond);
        if (mockData)
            expect(mockRespond.status).toHaveBeenCalledWith(400);
            expect(mockRespond.json).toHaveReturnedWith('User registered successfully')
    });

    it ('should send status 201 when succesfully register user', async () => {
        await authRegisterController(mockDBClient, mockData, mockRespond);
        expect(mockData).toEqual({
            body: {
                username: 'username1',
                password: expect.anything()
            }
        });
        expect(mockRespond.status).toHaveBeenCalledWith(201);
        expect(mockRespond.json).toHaveReturnedWith('User registered successfully');

    });

    it ('should send status 500 when failed to register user and when missing username and/or password', async () => {
        await authRegisterController(mockDBClient, {}, mockRespond);
        expect(mockRespond.status).toHaveBeenCalledWith(500);
        expect(mockRespond.json).toHaveReturnedWith('Failed to register user');

    })
});
