const { MongoClient } = require('mongodb');

class DatabaseManager {
  constructor(uri) {
    this.uri = uri;
    this.client = new MongoClient(uri);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  getClient() {
    return this.client;
  }
}

// Create a singleton instance of the DatabaseManager
const uri = "mongodb+srv://<username>:<password>@luminex-petro.walmhvt.mongodb.net/?retryWrites=true&w=majority&appName=Luminex-Petro";
const dbManager = new DatabaseManager(uri);

module.exports = dbManager;
