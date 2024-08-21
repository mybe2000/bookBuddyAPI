const express = require("express");
const userRouter = express.Router();

userRouter.get("/me", (req, res) => {
  res.send("here is account");
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
