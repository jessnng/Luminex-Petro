const express = require('express')
const app = express()
const path = require('path');
// const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'pages')));
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use((req, res, next) => { //CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// CONNECT TO MONGODB ATLAS
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://testperso:6AVk39xBYJb1dAkS@test.4hg8rme.mongodb.net/?retryWrites=true&w=majority&appName=test";
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
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// LOGIN ROUTE
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try{
    const database = client.db("appdb"); 
    const collection = database.collection("users"); 

    const user = await collection.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'User not found or invalid credentials' });
    }

    // If username and password are correct, return a success message
    const redirectUrl = '/Profile'; // Specify the URL you want to redirect to
    res.json({ message: 'Login successful', user, redirectUrl });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/register', async (req, res) => {
  try{
    const data = {
        username: req.body.username,
        password: req.body.password
    }

    const db = client.db("appdb");
    const collection = db.collection("users");

    const userdata = await collection.insertOne(data);
    console.log(userdata);
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register user" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
