const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connect() {
  try {
    if (!db) {
      await client.connect(); 
      db = client.db("gc01"); 
      console.log("Database connected");
    }
  } catch (error) {
    console.error("Database connection error:", error);
    await client.close();
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connect() first.");
  }
  return db;
}

module.exports = {
  connect,
  getDB,
};
