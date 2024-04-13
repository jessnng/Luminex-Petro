const { loginController } = require('../controllers/loginUser.js');
const bcrypt = require('bcrypt');

describe('Login Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if required fields are missing', async () => {
    await loginController(null, req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  test('should return 401 if user not found or invalid credentials', async () => {
    req.body.username = 'nonexistentuser';
    req.body.password = 'wrongpassword';
    const mockCollection = {
      findOne: jest.fn().mockReturnValue(null)
    };
    const mockClient = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue(mockCollection)
      })
    };
    global.client = mockClient;

    await loginController(mockClient, req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found or invalid credentials' });
  });

  test('should return login successful with user-profile redirect', async () => {
    req.body.username = 'existinguser';
    req.body.password = 'correctpassword';
    const mockCollection = {
      findOne: jest.fn().mockReturnValue({ 
        username: 'existinguser', 
        password: await bcrypt.hash('correctpassword', 10),
        fullName: 'John Doe', 
        address: { address1: 'Some Address', city: 'City', state: 'State', zipcode: '12345' }
      })
    };
    const mockClient = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue(mockCollection)
      })
    };
    global.client = mockClient;

    await loginController(mockClient, req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', username: 'existinguser', redirectTo: '/user-profile.html' });
  });

  test('should return login successful with profile creation redirect', async () => {
    req.body.username = 'existinguser';
    req.body.password = 'correctpassword';
    const mockCollection = {
      findOne: jest.fn().mockReturnValue({ 
        username: 'existinguser', 
        password: await bcrypt.hash('correctpassword', 10) })
    };
    const mockClient = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockImplementation((collectionName) => {
          if (collectionName === 'users') return mockCollection;
        })
      })
    };
    global.client = mockClient;

    await loginController(mockClient, req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', username: 'existinguser', redirectTo: '/Profile.html' });
  });

  test('should return 500 for internal server error', async () => {
    req.body.username = 'existinguser';
    req.body.password = 'correctpassword';
    const mockCollection = {
      findOne: jest.fn().mockRejectedValue(new Error('Some error'))
    };
    const mockClient = {
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue(mockCollection)
      })
    };
    global.client = mockClient;

    await loginController(mockClient, req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
