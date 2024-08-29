const express = require("express");
const booksRouter = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
} = require("../db/books");

booksRouter.get("/", async (req, res, next) => {
  try {
    const results = await getBooks();
    res.send(results);
  } catch (error) {
    next(error);
  }
});

booksRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getBook(id);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

booksRouter.post("/", async (req, res) => {
  try {
    const result = await createBook(req.body);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send(err);
  }
});

booksRouter.delete("/:id", async (req, res) => {
  try {
    // const { id } = req.params;
    const result = await deleteBook(req.params.id);
    res.send({ message: "book deleted", id: result });
  } catch (error) {
    console.log(error);
  }
});

booksRouter.patch("/:id", async (req, res) => {
  try {
    const result = await updateBook(req.params.id, req.body.available);
    res.send({ message: "book updated", result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = booksRouter;
