const quoteHistoryController = async (client, req, res) => {
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
  
module.exports = { quoteHistoryController };
