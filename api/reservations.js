const express = require("express");
const reservationsRouter = express.Router();
const { requireUser } = require("./utils");

const {
  getReservation,
  getUsersReservations,
  deleteReservation,
  getBook,
  updateBook,
} = require("../db");

reservationsRouter.get("/", requireUser, async (req, res, next) => {
  try {
    const reservations = await getUsersReservations(req.user.id);
    console.log(reservations);
    res.send("reservations here");
  } catch (error) {
    next(error);
  }
});

reservationsRouter.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const reservation = await getReservation(req.params.id);
    console.log("reservation", reservation);
    if (!reservation) {
      next({ name: "NoReservationFound", message: "No reservation found" });
      return;
    } else if (req.user.id !== reservation.userid) {
      next({
        name: "Permission denied",
        message: "You do not have permission to return this book",
      });
      return;
    } else {
      const deletedReservation = await deleteReservation(req.params.id);

      const book = await getBook(deletedReservation.booksid);
      if (deletedReservation) {
        updateBook(book.id, true);
      }
      res.send({ deletedReservation });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = reservationsRouter;
