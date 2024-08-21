const express = require("express");
const userRouter = express.Router();
const { getUsers, getUserById } = require("../db/users");

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
userRouter.post("/register", (req, res) => {
  console.log(req.body);
  res.send("user registered");
});

userRouter.post("/login", (req, res) => {
  console.log("request body", req.body);
  res.send("user logged in");
});

module.exports = userRouter;
