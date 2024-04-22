const getAddressController = async (client, req, res) => {
    try {
      const { username } = req.body;
  
      const db = client.db("appdb");
      const collection = db.collection("users");
  
      const existingUser = await collection.findOne({ username });
  
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
        const address = existingUser.address; // Assuming the address is stored in the 'address' field of the user profile
        
      res.status(200).json({ address });
    } catch (error) {
      console.error("Error retrieving user address:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = { getAddressController };
