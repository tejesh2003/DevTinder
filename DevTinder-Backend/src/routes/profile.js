const express = require("express");
const { userAuth } = require("../middlewares/auth.js");

const profileRouter = express.Router();

//get user profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error in fetching profile " + err.message);
  }
});

module.exports = profileRouter;
