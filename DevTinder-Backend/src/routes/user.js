const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

const SAFE_DATA=["firstName","lastName","age","gender","about","skills"];
//requests that the user need to review
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const user = req.user;
    let requests = await ConnectionRequestModel.find({
      receiver: user._id,
      status: "interested",
    }).populate("sender",SAFE_DATA);
    res.send(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//established connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    let requests = await ConnectionRequestModel.find({
      $or: [
        { receiver: user._id, status: "accepted" },
        { sender: user._id, status: "accepted" },
      ],
    }).populate("sender",SAFE_DATA )
    .populate("receiver", SAFE_DATA);
    let connections= requests.map((request)=>{
      return request.sender.id.toString()===user._id.toString() ? request.receiver : request.sender;
    })
    res.send(connections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = userRouter;
