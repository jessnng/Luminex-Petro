const { authRegisterController } = require('../controllers/registerUser.js');
const collection = require('../controllers/registerUser.js');

const mockRequest = {
    body: {
        username: 'username1',
        password: 'password1',
    },
};

const mockRespond = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x),
};

it ('should send a status 400 when user exits', async () => {
    await authRegisterController(mockRequest, mockRespond);
    
});