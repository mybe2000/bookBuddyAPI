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

app.use((error, req, res, next) => {
  console.log("ERROR", error);
  res.send({
    message: "SOMETHING WENT WRONG",
  });
});

app.listen(PORT, () => {
  console.log(`Server alive on port ${PORT}`);
});
