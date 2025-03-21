const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { toUserId, status } = req.params;
      if (userId === toUserId) {
        return res
          .status(400)
          .json({ message: "You can't send a request to yourself" });
      }
      if (!["interested", "ignored"].includes(status)) {
        throw new Error("Invalid status");
      }
      const rec = await User.findById(toUserId);
      if (!rec) {
        throw new Error("User not found");
      }
      const reqId = await ConnectionRequest.findOne({
        $or: [
          { sender: userId, receiver: toUserId },
          { sender: toUserId, receiver: userId },
        ],
      });
      if (reqId) {
        throw new Error("Request request has already been sent");
      }
      const connection = new ConnectionRequest({
        sender: userId,
        receiver: toUserId,
        status: status,
      });
      await connection.save();
      res.send("Connection request sent successfully");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
