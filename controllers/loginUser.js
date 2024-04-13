const bcrypt = require('bcrypt');

const loginController = async (client, req, res) => {
    const { username, password } = req.body;
  
    if( !username || !password){
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
  
    try{
      const database = client.db("appdb"); 
      const collection = database.collection("users"); 
  
      const user = await collection.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'User not found or invalid credentials' });
      }
  
      const userProfile = await client.db("appdb").collection("users").findOne({ username });
      console.log(userProfile)
      if (userProfile && userProfile.fullname && userProfile.address.address1 && userProfile.address.city && userProfile.address.state && userProfile.address.zipcode) {
        // If profile information exists, redirect to user-profile
        return res.json({ message: 'Login successful', username : username, redirectTo: '/user-profile.html' });
      } else {
        // If profile information doesn't exist, redirect to Profile.html
        return res.json({ message: 'Login successful', username: username, redirectTo: '/Profile.html' });
      }
  
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500);
      res.json({ error: 'Internal server error' });
    }
  };

  module.exports = { loginController };