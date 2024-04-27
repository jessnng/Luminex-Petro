const bcrypt = require('bcrypt');
const dbManager = require('./databaseManager');

const authRegisterController = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;
    const client = dbManager.getClient();

    // Check for missing fields
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if password and confirmed password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and confirmed password do not match' });
    }
    
    const db = client.db("appdb");
    const collection = db.collection("users");

    // Check if username already exists
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await collection.insertOne({ username, password: hashedPassword });

    // Close the database connection
    await client.close();

    // Redirect user to Profile.html to complete their profile
    res.status(201).json({ message: 'User registered successfully', redirectTo: '/Profile.html' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to register user" });
  }
};

module.exports = { authRegisterController };

