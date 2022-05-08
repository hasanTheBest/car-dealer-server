const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // get featured cars for collection
    app.get("/featured", async (req, res) => {
      const query = {};
      const options = {
        sort: {
          _id: 1,
        },
      };
      const cursor = carCollection.find(query, options).limit(6);
      const cars = await cursor.toArray();

      // send the data
      res.send(cars);
    });

    // get all cars for collection
    app.get("/inventory", async (req, res) => {
      const query = {};
      const options = {
        sort: {
          _id: -1,
        },
      };
      const cursor = carCollection.find(query, options);
      const cars = await cursor.toArray();

      // send the data
      res.send(cars);
    });

    // get a single car
    app.get("/inventory/:id", async (req, res) => {
      const { id } = req.params;
      const query = {
        _id: ObjectId(id),
      };

      const car = await carCollection.findOne(query);

      // send data
      res.send(car);
    });

    // get the user's collection
    app.get("/myItems", async (req, res) => {
      const { user } = req.query;

      const query = {
        email: user,
      };

      const cars = carCollection.find(query);
      const result = await cars.toArray();

      // send data
      res.send(result);
    });

    // update quantity of the specific car
    app.put("/inventory/:id", async (req, res) => {
      const { id } = req.params;
      const { quantity } = req.body;

      const filter = {
        _id: ObjectId(id),
      };

      const options = {
        upsert: true,
      };

      const updateDoc = {
        $set: {
          quantity: parseInt(quantity),
        },
      };

      const result = await carCollection.updateOne(filter, updateDoc, options);

      res.send(result);
    });

    // deleting a doc
    app.delete("/inventory/:id", async (req, res) => {
      const { id } = req.params;

      const query = {
        _id: ObjectId(id),
      };

      const result = await carCollection.deleteOne(query);

      if (result.deletedCount === 1) {
        res.send(result);
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
    });

    // inserting a doc
    app.post("/addItem", async (req, res) => {
      const result = await carCollection.insertOne(req.body);

      res.send(result);
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
