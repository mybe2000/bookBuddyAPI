const express = require("express");
const booksRouter = express.Router();
const { getBooks, getBook } = require("../db/books");

booksRouter.get("/", async (req, res) => {
  try {
    const results = await getBooks();

    res.send(results);
  } catch (error) {
    res.send({ error, message: "something went wrong" });
  }
});

booksRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getBook(id);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = booksRouter;
