const express = require("express");
const { userAuth } = require("../middlewares/auth.js");

const requestRouter = express.Router();

requestRouter.post("/sendconnection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send("Connection req sent");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = requestRouter;
