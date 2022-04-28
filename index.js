const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

/**
 * DB Connection
 * */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.idolr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const carCollection = client.db("carDB").collection("carCollection");

    // get a car for banner
    app.get("/banner", async (req, res) => {
      const query = {};
      const options = {
        sort: { price: -1 },
      };
      const cursor = carCollection.find(query, options).limit(1);
      const car = await cursor.toArray();

      // send data
      res.send(car);
    });

    // get 8 cars for collection
    app.get("/featured", async (req, res) => {
      const query = {};
      const cursor = carCollection.find(query).limit(8);
      const cars = await cursor.toArray();

      // send the data
      res.send(cars);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// base url
app.get("/", (req, res) => {
  res.send("Car dealer Server running");
});

// listen to the port
app.listen(port, () => {
  console.log("Car Server listening to the port", port);
});
