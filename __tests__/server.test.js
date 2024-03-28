//const collection = require('../controllers/server')

const request = {
    body: {
        username: 'username1',
        password: 'password1',
    },
};

const respond = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x),
};

it ('should send a status 400 when user exits', async () => {
    
});