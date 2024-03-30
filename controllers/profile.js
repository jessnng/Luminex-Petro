// const bcrypt = require('bcrypt');

// // CONNECT TO MONGODB ATLAS
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@test.4hg8rme.mongodb.net/?retryWrites=true&w=majority&appName=test";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     await client.connect();
//   } catch(err) {
//     console.error(err);
//   }
// }
// run().catch(console.dir);


const updateProfileController = async (req, res) => {
    try {
      const username = req.params.username;
      const { fullname, address1, address2, city, state, zipcode } = req.body;
  
      // Check if required fields are missing or empty
      if (!fullname || !address1 || !city || !state || !zipcode) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const newData = {
        fullname,
        address1,
        address2: address2 || "", // Optional field
        city,
        state,
        zipcode
      };
  
      const db = client.db("appdb");
      const collection = db.collection("profile");
  
      // Check if the user exists before updating
      const existingUser = await collection.findOne({ username });
  
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const result = await collection.updateOne({ username }, { $set: newData });
  
      if (result.modifiedCount === 0) {
        return res.status(500).json({ error: 'Failed to update profile' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error("Error while updating user profile:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = { updateProfileController };
