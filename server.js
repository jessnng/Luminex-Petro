const express = require('express')
const app = express()
const path = require('path');
const bcrypt = require('bcrypt');
const { authRegisterController } = require('/controllers/server');

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
app.post('/register', authRegisterController);

// Create user profile route
app.post('/profile/:username/update', async (req, res) => {
  try {
    const username = req.params.username;
    const { fullname, address1, city, state, zipcode } = req.body;

    // Check if required fields are missing or empty
    if (!fullname || !address1 || !city || !state || !zipcode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newData = {
      fullname,
      address1,
      address2: req.body.address2 || "", // Optional field
      city,
      state,
      zipcode
    };

    const database = client.db("appdb"); 
    const collection = database.collection("profile"); 

    const result = await collection.updateOne({ username }, { $set: newData });

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error("Error while updating user profile:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to render the user profile page
app.get('/user-profile', async (req, res) => {
  try {
      // Connect to MongoDB
      await client.connect();
      const database = client.db("appdb");
      const collection = database.collection("user-profile"); 

      // Fetch user profile data from the database
      const userProfile = await collection.findOne({ username: req.query.username }); // Assuming you pass the username as a query parameter

      // Render the user profile page with dynamic data
      res.render('user-profile', { userProfile });
  } catch (error) {
      console.error("Error retrieving user profile:", error);
      res.status(500).send("Internal Server Error");
  }
});

// PORT for dev
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server
