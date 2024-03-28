async function authRegisterController (req, res) {
    try{
      const { username, password } = req.body;
  
      const db = client.db("appdb");
      const collection = db.collection("users");
  
      const existingUser = await collection.findOne({ username });
      if (existingUser) {
        res.status(400);
        res.json({ message: "Username already exists" });
      }
  
      // Encrypt password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
      await collection.insertOne({ username, password: hashedPassword });
      
      res.status(201);
      res.json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to register user" });
    }
  }

  module.exports = {authRegisterController};