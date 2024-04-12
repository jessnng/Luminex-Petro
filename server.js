const express = require('express')
const app = express()
const path = require('path');
const { authRegisterController } = require('../Luminex-Petro/controllers/registerUser');
const { quoteFormController } = require('../Luminex-Petro/controllers/quoteForm');
const { loginController } = require('../Luminex-Petro/controllers/loginUser');
const { updateProfileController } = require('../Luminex-Petro/controllers/profile');
const { userProfileController } = require('../Luminex-Petro/controllers/userProfile')
const { quoteHistoryController } = require('../Luminex-Petro/controllers/quoteHistory');
const FuelPricing = require('../Luminex-Petro/controllers/pricingModule')


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

const uri = "mongodb+srv://<username>:<password>@luminex-petro.walmhvt.mongodb.net/?retryWrites=true&w=majority&appName=Luminex-Petro";

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
app.post('/login', function (req, res) {
  loginController(client, req, res)
});

// REGISTER USER ROUTE
app.post('/register', function(req, res) {
  authRegisterController(client, req, res)
});

// Create user profile route
app.post('/profile', function(req, res) {
  updateProfileController(client, req, res)
});

// Route to render the user profile page
app.get('/user-profile', async (req, res) => {
  userProfileController(client, req, res)
});

// create quote form route
app.post('/quote-form', function (req, res) {
  quoteFormController
})

app.post('/quote-history', async (req, res) => {
  quoteHistoryController(client, req, res)
});

// create pricing module route
app.get('/calculatePrice/:gallons', (req, res) => {
  const gallons = parseInt(req.params.gallons);
  const totalPrice = FuelPricing.calculateTotal(gallons);
  res.send(`Total price for ${gallons} gallons: $${totalPrice.toFixed(2)}`);
});

// PORT for dev
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
