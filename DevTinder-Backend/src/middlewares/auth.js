const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new Error("User is not authorized");
    }
    const decoded = jwt.verify(token, "TinderofDevelopers");
    const user = await User.findById(decoded._id);
    // console.log("user", user._id);
    // console.log("token", token);
    if (!user) throw new Error("User is not found");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error in authentication profile " + err.message);
  }
};

module.exports = {
  userAuth,
};
