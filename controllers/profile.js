const updateProfileController = async (client, req, res) => {
    try {
      const username = req.body.username;
      const { fullname, address1, address2, city, state, zipcode } = req.body;
  
      // Check if required fields are missing or empty
      if (!fullname || !address1 || !city || !state || !zipcode) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const address = {
        address1,
        address2: address2 || "", // Optional field
        city,
        state,
        zipcode
      };
  
      const db = client.db("appdb");
      const collection = db.collection("users");
  
      // Check if the user exists before updating
      const existingUser = await collection.findOne({ username });
  
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const result = await collection.updateOne({ username }, { $set: {fullname, address} });
  
      if (result.modifiedCount === 0) {
        return res.status(500).json({ error: 'Failed to update profile' });
      }
      res.status(200).json({ message: 'Profile updated successfully', redirect: 'user-profile.html'  });
    } catch (error) {
      console.error("Error while updating user profile:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = { updateProfileController };
