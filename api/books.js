const express = require("express");
const booksRouter = express.Router();

booksRouter.get("/", (req, res) => {
  res.send("here are the books");
});

module.exports = booksRouter;
