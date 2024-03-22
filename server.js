const express = require('express')
const app = express()
const path = require('path');
const bcrypt = require('bcrypt');

// allows access to files in folder
app.use(express.static(path.join(__dirname, 'pages')));
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use((req, res, next) => { //CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(err) {
    console.error(err);
  }
}
run().catch(console.dir);

// Define routes here
app.get('/', (req, res) => { // calls index.html separately since it's outside of page folder
  res.sendFile(path.join(__dirname, 'index.html'));
});

// LOGIN ROUTE
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try{
    const database = client.db("appdb"); 
    const collection = database.collection("users"); 

    const user = await collection.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'User not found or invalid credentials' });
    }

    res.json({ message: 'Login successful', user });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// REGISTER USER ROUTE
app.post('/register', async (req, res) => {
  try{
    const { username, password } = req.body;

    const db = client.db("appdb");
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
    await collection.insertOne({ username, password: hashedPassword });
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register user" });
  }
});

// PORT for dev
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
