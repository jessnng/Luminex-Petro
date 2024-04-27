const express = require('express')
const app = express()
const path = require('path');
//const bodyParser = require('body-parser');
const { authRegisterController } = require('../Luminex-Petro/controllers/registerUser');
const { quoteFormController } = require('../Luminex-Petro/controllers/quoteForm');
const { quoteHistoryController} = require('../Luminex-Petro/controllers/quoteHistory');
const { loginController } = require('../Luminex-Petro/controllers/loginUser');
const { updateProfileController } = require('../Luminex-Petro/controllers/profile');
const { userProfileController } = require('../Luminex-Petro/controllers/userProfile');
const { getAddressController } = require('../Luminex-Petro/controllers/getAddress');
const { getRateHistoryFactor } = require('../Luminex-Petro/controllers/getHistory'); // Ensure the correct path
const { popupProfileController } = require('../Luminex-Petro/controllers/popupProfile');
//const { FuelPricing } = require('../Luminex Petro/controllers/pricingModule');
//const { getPricePerGallon } = require('../Luminex Petro/controllers/pricingModule')

// Use body-parser middleware
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

// allows access to files in folder
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'controllers')));
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
const uri = "mongodb+srv://<username>:<password>@luminex-petro.walmhvt.mongodb.net/appdb";

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
  authRegisterController(req, res)
});

// Create user profile route
app.post('/profile', function(req, res) {
  updateProfileController(client, req, res)
});

// Route to render the user profile page
app.get('/user-profile', async (req, res) => {
  userProfileController(req, res)
});

// create quote form route
  app.post('/quote-form', (req, res) => {
    quoteFormController(req, res)
  });
  
  app.get('/quote-history', async (req, res) => {
    quoteHistoryController(req, res);
  });

  app.post('/get-address', async (req, res) => {
    getAddressController(req, res);
  });

  app.post('/update-popup-profile', function(req, res) {
    popupProfileController(client, req, res)
  });  

  app.post('/get-rate-history-factor', async (req, res) => {
    try {
      const { username } = req.body;
      const rateHistoryFactor = await getRateHistoryFactor(client, username);
      res.status(200).json({ rateHistoryFactor });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: 'Failed to fetch rate history factor' });
    }
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


