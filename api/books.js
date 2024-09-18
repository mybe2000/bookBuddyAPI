const express = require("express");
const booksRouter = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
} = require("../db");
const { createReservation } = require("../db/reservations");
const { requireUser } = require("./utils");

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
    if (isNaN(id) || req.params.id === " ") {
      next({
        name: "InvalidIdFormat",
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
    next(error);
  }
});

booksRouter.post("/", requireUser, async (req, res) => {
  try {
    const result = await createBook(req.body);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

booksRouter.delete("/:id", requireUser, async (req, res) => {
  try {
    const result = await deleteBook(req.params.id);
    console.log(result);
    res.send({ message: "book deleted", id: result });
  } catch (error) {
    res.send(error);
  }
});

booksRouter.patch("/:id", requireUser, async (req, res, next) => {
  console.log("user", req.user);
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || req.params.id === " ") {
      next({
        name: "InvalidIdFormat",
        message: "Not a valid book id",
      });
      return;
    }
    const result = await getBook(id);
    if (!result) {
      next({ name: "Not found", message: "no matching book found" });
      return;
    } else {
      const updated = await updateBook(req.body.available, req.params.id);
      console.log(updated);
      if (updated) {
        await createReservation({
          userId: req.user.id,
          booksId: updated.id,
        });
        res.send({ message: "updated successfully", updated });
      } else {
        next({ name: "UpdateError", message: "error updating this book" });
        return;
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = booksRouter;
