const dbManager = require('./databaseManager');
const { getRateHistoryFactor } = require('./getHistory');

const quoteHistoryController = async (req, res) => {
  try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Basic ')) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      const encodedCredentials = authHeader.replace('Basic ', '');
      const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
      const [username] = decodedCredentials.split(':'); // Extract the username

      console.log("Decoded credentials:", decodedCredentials);

      if (!username) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      // Add a console log for debugging
      console.log("Extracted username:", username);

      const client = await dbManager.getClient(); // Ensure the database client is connected
      const database = client.db("appdb");
      const collection = database.collection("fuel-quotes");

      const quoteHistory = await collection.find({ username }).toArray();

      if (quoteHistory.length === 0) {
          return res.status(200).json({
              rateHistoryFactor: 0.0,
              history: []
          });
      }

      // Get the rate history factor
      const rateHistoryFactor = await getRateHistoryFactor(client, username);

      return res.status(200).json({
          rateHistoryFactor,
          history: quoteHistory
      });

  } catch (error) {
      console.error("Error in quote history:", error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { quoteHistoryController };
