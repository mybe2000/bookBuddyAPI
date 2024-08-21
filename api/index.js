const express = require("express");

const apiRouter = express.Router();
apiRouter.use("/books", require("./books"));
apiRouter.use("/users", require("./users"));

// baseurl/api
apiRouter.get("/", (req, res) => {
  res.send("Hello from /api");
});

module.exports = apiRouter;
