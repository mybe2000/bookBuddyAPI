const express = require("express");
const userRouter = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  getUserByEmail,
} = require("../db/users");

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
    console.log(result);
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    console.log("request body", req.body);
    res.send("user logged in");
  } catch (error) {
    console.log(error);
  }
});

module.exports = userRouter;
