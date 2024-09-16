const express = require("express");
const userRouter = express.Router();
const {
  getUsers,
  getUser,
  getUserById,
  createUser,
  getUserByEmail,
  getUsersReservations,
} = require("../db");

const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");

userRouter.get("/", async (req, res) => {
  try {
    const results = await getUsers();
    res.send(results);
  } catch (error) {
    res.send({ error, message: "something went wrong" });
  }
});

userRouter.get("/me", requireUser, async (req, res) => {
  try {
    if (req.user) {
      const userReservations = await getUsersReservations(req.user.id);
      console.log(userReservations);
      req.user.books = userReservations;
      res.send(req.user);
    } else {
      res.send("Error, not logged in");
    }
  } catch (error) {}
});

userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getUserById(id);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

// POST to ${baseurl}/api/users/register
userRouter.post("/register", async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  if (!email) {
    next({ name: "EmailRequiredError", message: "email not provided" });
    return;
  }
  if (!password) {
    next({ name: "PasswordRequiredError", message: "password not provided" });
    return;
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      next({
        name: "ExistingUserError",
        message: "user already exists with that email",
      });
      return;
    }
    const result = await createUser(req.body);
    if (result) {
      const token = jwt.sign({ id: result.id, email }, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });
      console.log(token);
      res.send({
        message: "Registration successful",
        token,
        user: {
          id: result.id,
          firstname: result.firstname,
          lastname: result.lastname,
          email: result.email,
        },
      });
      return;
    } else {
      next({ name: "RegistrationError", message: "error registering" });
      return;
    }
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "please supply both email and password",
    });
  }

  try {
    const result = await getUser(req.body);
    if (result) {
      const token = jwt.sign({ id: result.id, email }, process.env.JWT_SECRET, {
        expiresIn: "1w",
      });

      res.send({
        message: "logged in successfully",
        token,
      });
    } else {
      next({
        name: "incorrectCredentialsError",
        message: "username or password incorrect",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
