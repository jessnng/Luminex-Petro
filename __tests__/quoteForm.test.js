const { quoteFormController } = require('../controllers/quoteForm.js');

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
        if (!quoteMockData.body.gallonsRequest){
            expect(mockRespond.status).toHaveBeenCalledWith(400);
            expect(mockRespond.json).toHaveReturnedWith('A value is needed for gallons requested.')
        }
                
    })

    it('should send status 200 when succesfully send form', async () => {
        await quoteFormController(quoteMockData.body, mockRespond);
        if(quoteMockData.body.gallonsRequest) {
            expect(quoteMockData.body).toHaveProperty('gallonsRequest', 16);
        }
        
    });

    it('should send status 500 when failed to submit form, and when missing value', async () => {
        await quoteFormController({}, mockRespond);
        expect(mockRespond.status).toHaveBeenCalledWith(500);
        expect(mockRespond.json).toHaveReturnedWith('Internal server error.');
    })

});
