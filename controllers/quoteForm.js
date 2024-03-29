

// CONNECT TO MONGODB ATLAS
const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://<username>:<password>@test.4hg8rme.mongodb.net/?retryWrites=true&w=majority&appName=test";
const uri = "mongodb+srv://jessica:Elflove13%21@test.4hg8rme.mongodb.net/?retryWrites=true&w=majority&appName=test";

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

const quoteFormController = async (req, res) => {

    try {
      const { gallonsRequest } = req.body;
      if (!gallonsRequest)
      {
        return res.status(400).json({ error: "A value is needed for gallons requested."})
      }
  
      var deliveryAddress = sessionStorage.getItem("userAddress");
      var suggestedPrice = sessionStorage.getItem("suggestedPrice");
      var amountDue = sessionStorage.getItem("amountDue");
  
      const data = {
        gallonsRequest,
        deliveryAddress,
        deliveryDate,
        suggestedPrice,
        amountDue
      };
  
      const db = client.db("appdb");
      const collection = db.collection("quote-history");
  
      // add to quote history collection
      await collection.insertOne({data});
  
      res.status(200);
      res.json({ message: 'Quote form successfully submitted.'})
  
    } catch (error) {
      console.error("Error submitting quote form: ", error);
      res.status(500);
      res.json("Internal server error.")
    }
}

module.exports = { quoteFormController };