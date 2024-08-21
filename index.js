const express = require("express");
const app = express();

const PORT = 3000;

require("dotenv").config();

const client = require("./db/client");

client.connect();

app.use(express.json());

app.use("/api", require("./api"));

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(PORT, () => {
  console.log(`Server alive on port ${PORT}`);
});
