const { quoteHistoryController } = require('../controllers/quote-history');

describe('quoteHistoryController', () => {
  it('should return quote history for a logged-in user', async () => {
    // Mock request and response objects
    const req = {
      headers: {
        authorization: 'mockAuthToken'
      }
    };

    // Mock response methods
    const jsonMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    const res = {
      status: statusMock
    };

    // Mock client object
    const client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([{ quote: 'mockQuote' }]) // Mock quote history data
    };

    // Call the controller function
    await quoteHistoryController(client, req, res);

    // Assert that the response status code is 200
    expect(res.status).toHaveBeenCalledWith(200);
    // Assert that the response JSON contains the expected quote history
    expect(jsonMock).toHaveBeenCalledWith([{ quote: 'mockQuote' }]);
  });

  it('should return 401 for an unauthorized user', async () => {
    // Mock request object with no authorization header
    const req = {
      headers: {}
    };

    // Mock response methods
    const jsonMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    const res = {
      status: statusMock
    };

    // Mock client object
    const client = {};

    // Call the controller function
    await quoteHistoryController(client, req, res);

    // Assert that the response status code is 401
    expect(res.status).toHaveBeenCalledWith(401);
    // Assert that the response JSON contains the expected error message
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 404 if quote history is not found', async () => {
    // Mock request object with a logged-in user
    const req = {
      headers: {
        authorization: 'mockAuthToken'
      }
    };

    // Mock response methods
    const jsonMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    const res = {
      status: statusMock
    };

    // Mock client object with empty quote history
    const client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([]) // Empty quote history
    };

    // Call the controller function
    await quoteHistoryController(client, req, res);

    // Assert that the response status code is 404
    expect(res.status).toHaveBeenCalledWith(404);
    // Assert that the response JSON contains the expected error message
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Quote history not found' });
  });

  it('should return 500 if an error occurs', async () => {
    // Mock request object with a logged-in user
    const req = {
      headers: {
        authorization: 'mockAuthToken'
      }
    };

    // Mock response methods
    const jsonMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    const res = {
      status: statusMock
    };

    // Mock client object with an error
    const client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockRejectedValue(new Error('Database error')) // Simulate database error
    };

    // Call the controller function
    await quoteHistoryController(client, req, res);

    // Assert that the response status code is 500
    expect(res.status).toHaveBeenCalledWith(500);
    // Assert that the response JSON contains the expected error message
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
