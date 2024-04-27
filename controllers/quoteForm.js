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