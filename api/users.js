const express = require("express");
const userRouter = express.Router();
const {
  getUsers,
  getUser,
  getUserById,
  createUser,
  getUserByEmail,
} = require("../db/users");

const jwt = require("jsonwebtoken");

userRouter.get("/", async (req, res) => {
  try {
    const results = await getUsers();
    res.send(results);
  } catch (error) {
    res.send({ error, message: "something went wrong" });
  }
});

userRouter.get("/me", (req, res) => {
  res.send("here is my account");
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
userRouter.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!email || email === "") {
    res.send("email not provided");
    return;
  }
  if (!password || password === "") {
    res.send("password not provided");
    return;
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.send("user already exists with that email");
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
      res.send("error registering");
      return;
    }
    console.log(result);
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

userRouter.post("/login", async (req, res) => {
  console.log(req.body.email);
  const { email, password } = req.body;
  if (!email || !password) {
    res.send("Missing credentials- must supply both email and password");
    return;
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
      next({ name: "incorrectCredentialsError" });
      // res.send("wrong credentials");
    }
  } catch (error) {
    res.send("something went wrong");
  }
});

module.exports = userRouter;
