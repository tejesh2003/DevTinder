const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const User = require("../models/user.js");
const profileRouter = express.Router();

//get user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error in fetching profile " + err.message);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    const data = req.body;
    const ALLOWED_FIELDS = ["photoUrl", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_FIELDS.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid update fields");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Max number of skills are 10");
    }
    await User.findByIdAndUpdate(userId, data, { runValidators: true });
    res.send(user.firstName + " your profile is updated");
  } catch (err) {
    res.status(400).send("Error in updating profile " + err.message);
  }
});

module.exports = profileRouter;
