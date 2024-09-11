const express = require("express");
const app = express();
const PORT = 3000;

require("dotenv").config();

const client = require("./db/client");
client.connect();

app.use(express.json());

// console.log(process.env.JWT_SECRET);
app.use("/api", require("./api"));

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.get('*', (req, res) => {
  res.status(404).send({
    error: '404 - Not Found',
    message: 'No route found for requested URL'
  })
});

app.use((error, req, res, next) => {
  console.log("Error", error);
  if (res.statusCode < 400) res.status(500);
  res.send({
    name: error.name,
    message: error.message
  })
});

app.listen(PORT, () => {
  console.log(`Server alive on port ${PORT}`);
});
