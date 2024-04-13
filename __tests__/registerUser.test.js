const { authRegisterController } = require('../controllers/registerUser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// Mock req and res objects
const mockRequest = (body = {}) => ({
  body
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock MongoClient and bcrypt
jest.mock('mongodb');
jest.mock('bcrypt');

describe('authRegisterController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if missing required fields', async () => {
    await authRegisterController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  it('should return 400 if password and confirmPassword do not match', async () => {
    req.body = { username: 'testuser', password: 'password1', confirmPassword: 'password2' };
    await authRegisterController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Password and confirmed password do not match' });
  });

  it('should return 400 if username already exists', async () => {
    // Mock findOne to return existing user
    const findOneMock = jest.fn().mockResolvedValue({ username: 'existingUser' });
    MongoClient.prototype.db.mockReturnValueOnce({ collection: jest.fn().mockReturnValueOnce({ findOne: findOneMock }) });

    req.body = { username: 'existingUser', password: 'password', confirmPassword: 'password' };
    await authRegisterController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
  });

  it('should return 201 if user registered successfully', async () => {
    // Mock findOne to return null (user does not exist)
    const findOneMock = jest.fn().mockResolvedValue(null);
    MongoClient.prototype.db.mockReturnValueOnce({ collection: jest.fn().mockReturnValueOnce({ findOne: findOneMock }) });

    // Mock bcrypt.hash to return hashed password
    const hashedPassword = '$2b$10$yJcVhDMeBTadJqL7cSzSDOM10tGv3I4qstTnzw2EhaFQ88n4fLkNu';
    bcrypt.hash.mockResolvedValue(hashedPassword);

    req.body = { username: 'newUser', password: 'password', confirmPassword: 'password' };
    await authRegisterController(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully', redirectTo: 'login.html' });
  });

  it('should return 500 if an error occurs', async () => {
    // Mock findOne to throw an error
    const findOneMock = jest.fn().mockRejectedValue(new Error('Database error'));
    MongoClient.prototype.db.mockReturnValueOnce({ collection: jest.fn().mockReturnValueOnce({ findOne: findOneMock }) });

    req.body = { username: 'testuser', password: 'password', confirmPassword: 'password' };
    await authRegisterController(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to register user' });
  });
});
