/*const quoteHistoryController = async (client, req, res) => {
    try {
      const loggedInUser = req.query.username;
  
      if (!loggedInUser) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const database = client.db("appdb");
      const collection = database.collection("fuel-quotes");
  
      // Fetch quote history data from the database
      const quoteHistory = await collection.find({ username: loggedInUser }).toArray();
  
      if (!quoteHistory || quoteHistory.length === 0) {
        return res.status(404).json({ error: 'Quote history not found' });
      }
  
      res.status(200).json(quoteHistory);
    } catch (error) {
      console.error("Error retrieving quote history:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
module.exports = { quoteHistoryController };  */

const { getRateHistoryFactor } = require('./getHistory.js'); // Adjust path as needed
const { MongoClient } = require('mongodb');
const mongoURL= 'mongodb+srv://<username>:<password>@luminex-petro.walmhvt.mongodb.net/appdb';

const quoteHistoryController = async (client, req, res) => {
    try {
        const loggedInUser = req.headers.authorization;

        if (!loggedInUser) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const database = client.db("appdb");
        const collection = database.collection("fuel-quotes");

        // Fetch quote history
        const quoteHistory = await collection.find({ username: loggedInUser }).toArray();

        if (quoteHistory.length === 0) {
            return res.status(200).json({
                rateHistoryFactor: 0.00,
                history: []
            });
        }

        const rateHistoryFactor = await getRateHistoryFactor(client, loggedInUser);

        res.status(200).json({
            rateHistoryFactor: rateHistoryFactor,
            history: quoteHistory
        });
    } catch (error) {
        console.error("Error retrieving quote history:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    quoteHistoryController,
    getRateHistoryFactor
};
