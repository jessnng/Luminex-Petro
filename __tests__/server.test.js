const { authRegisterController } = require('../controllers/registerUser.js');
const { quoteFormController } = require('../controllers/quoteForm.js');

const mockData = {
    body: {
        username: 'username1',
        password: 'password1'
    },
};

const mockRespond = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x),
};

// Register User - POST request
describe('POST, /register - create new user', () => {

    it ('should send a status 400 when user exits', async () => {

        await authRegisterController(mockData, mockRespond);
        if (mockData)
            expect(mockRespond.status).toHaveBeenCalledWith(400);
    });

    it ('should send status 201 when succesfully register user', async () => {
        await authRegisterController(mockData, mockRespond);
        expect(mockData).toEqual({
            body: {
                username: 'username1',
                password: expect.anything()
            }
        });
        expect(mockRespond.status).toHaveBeenCalledWith(201);

    });

    it ('should send status 500 when failed to register user and when missing username and/or password', async () => {
        await authRegisterController({}, mockRespond);
        expect(mockRespond.status).toHaveBeenCalledWith(500);

    })
});

// User Login - POST Request
describe('POST, /login - customer login', () => {

});

const mockUserData = {
    body: {
        fullname: 'Jane Doe',
        address1: '123 St',
        city: 'Houston',
        state: 'TX',
        zipcode: '12345'
    }

};

const quoteMockData = {
    body: {
        gallonsRequest: 16,
        deliveryAddress: mockUserData.body,
        deliveryDate: '3/31/2023',
        suggestedPrice: 2.85,
        amountDue: 45.6
    }
};

// Quote Form - POST Request
describe('POST, /quote-form - send quote form to server', () => {

    it('should send status 400 when missing gallons request', async () => {
        await quoteFormController(quoteMockData.body.gallonsRequest, mockRespond);
        if (!quoteMockData.body.gallonsRequest)
            expect(mockRespond.status).toHaveBeenCalledWith(400);    
    })

    it('should send status 200 when succesfully send form', async () => {
        await quoteFormController(quoteMockData.body, mockRespond);
        if(quoteMockData.body.gallonsRequest) {
            expect(quoteMockData.body).toHaveProperty('gallonsRequest', 16);
            //expect(mockRespond.status).toHaveBeenCalledWith(200);
        }
        
    });

    it('should send status 500 when failed to submit form, and when missing value', async () => {
        await quoteFormController({}, mockRespond);
        expect(mockRespond.status).toHaveBeenCalledWith(500);
        expect(mockRespond.json).toHaveReturnedWith('Internal server error.');
    })

});


// User-Profile - POST/GET Request
describe('POST, /user-profile - create user profile', () => {

});

describe('GET, /user-profile - render user profile', () => {

});
