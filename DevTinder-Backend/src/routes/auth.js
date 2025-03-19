const express = require("express");
const User = require("../models/user.js");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("../utils/validation.js");

//user signup
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, skills, emailId, about, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      about,
      password: passwordHash,
    });

    await user.save();
    res.send("User created");
  } catch (err) {
    res.status(400).send("Error in creating user" + err.message);
  }
});

//login user
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");
    const passwordHash = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    } else {
      const token = jwt.sign({ _id: user._id }, "TinderofDevelopers", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      res.send("Login Successful");
    }
  } catch (err) {
    res.status(400).send("Error in login: " + err.message);
  }
});

//logout user
authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("Logged out");
  } catch (err) {
    res.status(400).send("Error in logout: " + err.message);
  }
});

module.exports = authRouter;
