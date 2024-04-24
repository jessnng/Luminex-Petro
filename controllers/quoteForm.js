// CONNECT TO MONGODB ATLAS
// const { MongoClient } = require('mongodb');
// // const uri = "mongodb+srv://<username>:<password>@luminex-petro.walmhvt.mongodb.net/?retryWrites=true&w=majority&appName=Luminex-Petro";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true 
// });
// async function run() {
//   try {
//     await client.connect();
//     //console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } catch(err) {
//     console.error(err);
//   }
// }
// run().catch(console.error);
const dbManager = require('./databaseManager');

const quoteFormController = async (req, res) => {

    try {
      const { username, gallonsRequest, deliveryAddress, deliveryDate, suggestedPrice, amountDue } = req.body;
      await dbManager.connect();
      const client = dbManager.getClient();

      if (!gallonsRequest)
      {
        return res.status(400).json({ error: "A value is needed for gallons requested."})
      }

      const db = client.db("appdb");
      const collection = db.collection("fuel-quotes");

      //const { deliveryAddress, suggestedPrice, amountDue } = userData;
  
      // var deliveryAddress = sessionStorage.getItem("userAddress");
      // var suggestedPrice = sessionStorage.getItem("suggestedPrice");
      // var amountDue = sessionStorage.getItem("amountDue");
  
      // add to quote history collection
      await collection.insertOne({
        username,
        gallonsRequest,
        deliveryAddress: {
          address1: deliveryAddress.address1,
          address2: deliveryAddress.address2,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          zipcode: deliveryAddress.zipcode
        },
        deliveryDate,
        suggestedPrice,
        amountDue
      });
      await client.close();
  
      res.status(200);
      res.json({ message: 'Quote form successfully submitted.'})
  
    } catch (error) {
      console.error("Error submitting quote form: ", error);
      res.status(500);
      res.json("Internal server error.")
    }
}

module.exports = { quoteFormController };