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

// Mock MongoDB client for testing purposes
const mockDBClient = {
  db: () => ({
    collection: () => ({
      findOne: jest.fn(),
      insertOne: jest.fn(),
    }),
  }),
};

const authRegisterController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = mockDBClient.db("appdb");
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json("Username already exists");
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    await collection.insertOne({ username, password: hashedPassword });

    // Redirect user to Profile.html upon successful registration
    res.status(201).json({ redirectTo: '/Profile.html' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to register user" });
  }
};

module.exports = { authRegisterController };

