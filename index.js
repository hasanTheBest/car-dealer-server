const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// base url
app.get("./", (req, res) => {
  res.send("Car dealer Server running");
});

// listen to the port
app.listen(port, () => {
  console.log("Car Server listening to the port", port);
});
