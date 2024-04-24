const { query } = require('express');
const { quoteHistoryController } = require('../controllers/quoteHistory');
const { getRateHistoryFactor } = require('../controllers/getHistory');
const { DatabaseManager } = require('../controllers/databaseManager');

const dbManager = require('../controllers/databaseManager');

jest.mock('../controllers/databaseManager');

describe('quoteHistoryController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return quote history for a logged-in user', async () => {
    // Mock request and response objects
    const req = {
      headers: { authorization: 'mockAuthToken' }
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

    // Mock getRateHistoryFactor function
    const getRateHistoryFactor = jest.fn().mockResolvedValue(0.5);

    // Call the controller function
    dbManager.getClient.mockReturnValue(client);
    await quoteHistoryController(req, res);

    // Assert that the response status code is 200
    expect(res.status).toHaveBeenCalledWith(200);
    // Assert that the response JSON contains the expected quote history
    expect(jsonMock).toHaveBeenCalledWith({
      rateHistoryFactor: 0.5,
      history: [{ quote: 'mockQuote' }]
    });
    expect(getRateHistoryFactor).toHaveBeenCalledWith(client, 'mockAuthToken');
  });

  it('should return 401 for an unauthorized user', async () => {
    // Mock request object with no authorization header
    const req = {};

    // Mock response methods
    const jsonMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    const res = {
      status: statusMock
    };

    // Call the controller function
    dbManager.getClient.mockReturnValue(undefined);
    await quoteHistoryController(req, res);

    // Assert that the response status code is 401
    expect(res.status).toHaveBeenCalledWith(401);
    // Assert that the response JSON contains the expected error message
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 404 if quote history is not found', async () => {
    // Mock request object with a logged-in user
    const req = {
      headers: { authorization: 'mockAuthToken' }
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
    dbManager.getClient.mockReturnValue(client);
    await quoteHistoryController(req, res);

    // Assert that the response status code is 404
    expect(res.status).toHaveBeenCalledWith(404);
    // Assert that the response JSON contains the expected error message
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Quote history not found' });
  });

  it('should return 500 if an error occurs', async () => {
    // Mock request object with a logged-in user
    const req = {
      query: {
        username: 'mockUser'
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
    dbManager.getClient.mockReturnValue(client);
    await quoteHistoryController(req, res);

    // Assert that the response status code is 500
    expect(res.status).toHaveBeenCalledWith(500);
    // Assert that the response JSON contains the expected error message
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
  it('should return 401 if client object is undefined', async () => {
    const req = { headers: { authorization: 'mockAuthToken' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    dbManager.getClient.mockReturnValue(undefined);
  
    await quoteHistoryController(req, res);
  
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });
  it('should return 500 if an error occurs during database operation', async () => {
    // Mock request object with a logged-in user
    const req = {
      query: {
        username: 'mockUser'
      }
    };

    // Mock response objects
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock client object with an error
    const client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockRejectedValue(new Error('Database error'))
    };

    // Mock getClient to return a client object
    dbManager.getClient.mockResolvedValue(client);

    // Call the controller function
    await quoteHistoryController(req, res);

    // Assert that the response status code is 500
    expect(res.status).toHaveBeenCalledWith(500);
    // Assert that the response JSON contains the expected error message
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('getRateHistoryFactor', () => {
  it('should return the rate history factor for a valid username with existing history', async () => {
    // Mock the database client
    const client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([{ quote: 'mockQuote' }]) // Mock quote history data
    };

    // Call the function and assert the result
    const factor = await getRateHistoryFactor(client, 'validUsername');
    expect(factor).toEqual(0.01); // Assuming the factor calculation is correct
  });

  // Test for valid input and no existing history
  it('should return 0 if the user has no quote history', async () => {
    // Mock the database client
    const client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([]) // Empty quote history
    };

    // Call the function and assert the result
    const factor = await getRateHistoryFactor(client, 'validUsername');
    expect(factor).toEqual(0);
  });

  // Test for invalid input
  it('should throw an error if username is invalid or missing', async () => {
    // Call the function with invalid input and assert the thrown error
    await expect(getRateHistoryFactor({}, null)).rejects.toThrow('Invalid or missing username');
  });

  // Test for database error
  it('should throw an error if a database error occurs', async () => {
    // Mock the database client to throw an error
    const client = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockRejectedValue(new Error('Database error')) // Simulate database error
    };

    // Call the function and assert the thrown error
    await expect(getRateHistoryFactor(client, 'validUsername')).rejects.toThrow('Error retrieving rate history factor');
  });

});

// describe('getRateHistoryFactor', () => {
//   it('should return the rate history factor for a valid username with existing history', async () => {
//     // Mock the database client
//     const mockClient = {
//       db: jest.fn().mockReturnThis(),
//       collection: jest.fn().mockReturnThis(),
//       find: jest.fn().mockReturnThis(),
//       toArray: jest.fn().mockResolvedValue([{ quote: 'mockQuote' }]) // Mock quote history data
//     };

//     // Mock request and response objects
//     const mockReq = { body: { username: 'validUsername' } };
//     const mockRes = {};

//     // Call the function and assert the result
//     const factor = await getRateHistoryFactor(mockClient, mockReq, mockRes);
//     expect(factor).toEqual(0.01); // Assuming the factor calculation is correct
//   });

//   // Test for valid input and no existing history
//   it('should return 0 if the user has no quote history', async () => {
//     // Mock the database client
//     const mockClient = {
//       db: jest.fn().mockReturnThis(),
//       collection: jest.fn().mockReturnThis(),
//       find: jest.fn().mockReturnThis(),
//       toArray: jest.fn().mockResolvedValue([]) // Empty quote history
//     };

//     // Mock request and response objects
//     const mockReq = { body: { username: 'validUsername' } };
//     const mockRes = {};

//     // Call the function and assert the result
//     const factor = await getRateHistoryFactor(mockClient, mockReq, mockRes);
//     expect(factor).toEqual(0);
//   });

//   // Test for invalid input
//   it('should throw an error if username is invalid or missing', async () => {
//     // Mock the database client
//     const mockClient = {};

//     // Mock request and response objects
//     const mockReq = { body: { username: null } };
//     const mockRes = {};

//     // Call the function with invalid input and assert the thrown error
//     await expect(getRateHistoryFactor(mockClient, mockReq, mockRes)).rejects.toThrow('Invalid or missing username');
//   });

//   // Test for database error
//   it('should throw an error if a database error occurs', async () => {
//     // Mock the database client to throw an error
//     const mockClient = {
//       db: jest.fn().mockReturnThis(),
//       collection: jest.fn().mockReturnThis(),
//       find: jest.fn().mockReturnThis(),
//       toArray: jest.fn().mockRejectedValue(new Error('Database error')) // Simulate database error
//     };

//     // Mock request and response objects
//     const mockReq = { body: { username: 'validUsername' } };
//     const mockRes = {};

//     // Call the function and assert the thrown error
//     await expect(getRateHistoryFactor(mockClient, mockReq, mockRes)).rejects.toThrow('Error retrieving rate history factor');
//   });

// });

// describe('DatabaseManager', () => {
//   it('should connect to the database successfully', async () => {
//     // Mock the MongoClient and simulate successful connection
//     const client = {
//       connect: jest.fn().mockResolvedValue()
//     };

//     // Mock the DatabaseManager
//     const dbManager = new DatabaseManager('mock-uri');
//     dbManager.client = client;

//     // Call the connect method and assert the connection
//     await dbManager.connect();
//     expect(client.connect).toHaveBeenCalled();
//   });

//   it('should throw an error if connection to the database fails', async () => {
//     // Mock the MongoClient and simulate connection error
//     const client = {
//       connect: jest.fn().mockRejectedValue(new Error('Connection error'))
//     };

//     // Mock the DatabaseManager
//     const dbManager = new DatabaseManager('mock-uri');
//     dbManager.client = client;

//     // Call the connect method and assert the thrown error
//     await expect(dbManager.connect()).rejects.toThrow('Connection error');
//   });
//   it('should return the MongoDB client', () => {
//     // Mock the MongoClient
//     const client = {};

//     // Mock the DatabaseManager
//     const dbManager = new DatabaseManager('mock-uri');
//     dbManager.client = client;

//     // Call the getClient method and assert the returned client
//     expect(dbManager.getClient()).toEqual(client);
//   });
// });

describe('DatabaseManager', () => {
  // Test for successful connection
  it('should connect to the database successfully', async () => {
    // Mock the MongoClient and simulate successful connection
    const client = {
      connect: jest.fn().mockResolvedValue()
    };

    // Mock the DatabaseManager
    const dbManager = new DatabaseManager('mock-uri');
    dbManager.client = client;

    // Call the connect method and assert the connection
    await dbManager.connect();
    expect(client.connect).toHaveBeenCalled();
  });

  // Test for connection error
  it('should throw an error if connection to the database fails', async () => {
    // Mock the MongoClient and simulate connection error
    const client = {
      connect: jest.fn().mockRejectedValue(new Error('Connection error'))
    };

    // Mock the DatabaseManager
    const dbManager = new DatabaseManager('mock-uri');
    dbManager.client = client;

    // Call the connect method and assert the thrown error
    await expect(dbManager.connect()).rejects.toThrow('Connection error');
  });

  // Test for getClient method
  it('should return the MongoDB client', () => {
    // Mock the MongoClient
    const client = {};

    // Mock the DatabaseManager
    const dbManager = new DatabaseManager('mock-uri');
    dbManager.client = client;

    // Call the getClient method and assert the returned client
    expect(dbManager.getClient()).toEqual(client);
  });
});
