
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sttanminh:vYpIilvcj7wODJO0@cluster0.eycls3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



export default client