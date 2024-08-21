const express = require("express");
const app = express();

const PORT = 3000;

//before anything else:
require("dotenv").config();

const client = require("./db/client");

client.connect();
// console.log(process.env.TEST_VAR);
//use express.json BEFORE other app.use
app.use(express.json());

app.use("/api", require("./api"));

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.listen(PORT, () => {
  console.log(`Server alive on port ${PORT}`);
});
