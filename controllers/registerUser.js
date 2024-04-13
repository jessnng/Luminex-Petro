//const { authRegisterController } = require('../controllers/server.js');
/*
const bcrypt = require('bcrypt');

// CONNECT TO MONGODB ATLAS
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@test.4hg8rme.mongodb.net/?retryWrites=true&w=majority&appName=test";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(err) {
    console.error(err);
  }
}
run().catch(console.dir);


const authRegisterController = async(req, res) => {
  try{
    const { username, password } = req.body;

    if( !username || !password){
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = client.db("appdb");
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      res.status(400);
      res.json("Username already exists");
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
    await collection.insertOne({ username, password: hashedPassword });
    
    res.status(201);
    res.json("User registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json("Failed to register user");
  }
};

module.exports = { authRegisterController };  */

const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const mongoURL= 'mongodb+srv://<username>:<password>@luminex-petro.walmhvt.mongodb.net/appdb';

const authRegisterController = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // Check for missing fields
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if password and confirmed password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and confirmed password do not match' });
    }
    

    // Connect to the MongoDB database
    const client = new MongoClient(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
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

