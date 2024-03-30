const bcrypt = require('bcrypt');

const userProfileController = async (client, req, res) => {
  try {
    const { username } = req.query; // Assuming username is passed as a query parameter

    if (!username) {
      return res.status(400).json({ error: 'Missing username parameter' });
    }

    const database = client.db("appdb");
    const collection = database.collection("user-profile");

    // Fetch user profile data from the database
    const userProfile = await collection.findOne({ username });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.status(200);
    res.json({ message: 'User profile retrieved successfully', userProfile });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500);
    res.json({ error: 'Internal server error' });
  }
};

module.exports = { userProfileController };
