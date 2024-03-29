const express = require('express')
const app = express()
const path = require('path');
const bcrypt = require('bcrypt');
const { authRegisterController } = require('../Luminex-Petro/controllers/registerUser');
const { quoteFormController } = require('../Luminex-Petro/controllers/quoteForm');
const { loginController } = require('../Luminex-Petro/controllers/loginUser');

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
app.post('/login', function (client, req, res) {
  loginController(client, req, res)
});

// REGISTER USER ROUTE
app.post('/register', function(req, res) {
  authRegisterController
});

// Create user profile route
app.post('/profile/:username/update', function(req, res) {
  authProfileController
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

// create quote form route
app.post('/quote-form', function (req, res) {
  quoteFormController
})

// PORT for dev
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
