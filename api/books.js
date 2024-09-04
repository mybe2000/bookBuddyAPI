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

booksRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    console.log(id);
    if (isNaN(id) || req.params.id === "") {
      next({
        name: "Invalid Id Format",
        message: "provided request parameter is not valid book ID",
      });
      return;
    }

    const result = await getBook(id);
    if (!result) {
      next({ name: "Not Found", message: "No matching book found" });
      return;
    }
    res.send(result);
  } catch (error) {
    console.log(error);
    next(error);
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

booksRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id) || req.params.id === "") {
      next({
        name: "Invalid Format",
        message: "provided request parameter is not a valid book Id",
      });
      return;
    }

    const result = await getBook(id);
    if (!result) {
      next({ name: "Not Found", message: "No matching book found" });
      return;
    } else {
      const updated = await updateBook(req.params.id, req.body.available);
      if (updated) {
        res.send({
          message: "updated successfully",
          updated,
        });
      } else {
        next({
          name: "UpdateError",
          message: "there was an error updating this book",
        });
      }
      return;
    }
  } catch (error) {
    next(error);
  }
});

module.exports = booksRouter;
