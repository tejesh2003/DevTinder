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

requestRouter.patch(
  "/request/review/:status/:reqId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const { status, reqId } = req.params;
      if (!["accepted", "rejected"].includes(status)) {
        throw new Error("Invalid status");
      }
      const request = await ConnectionRequest.findById(reqId);
      if (!request) {
        throw new Error("Request not found");
      }
      if (request.status != "interested") {
        throw new Error("Request is not interested");
      }
      if (user._id.toString() !== request.receiver.toString()) {
        throw new Error(
          "You can't review a request that is not addressed to you"
        );
      }
      await ConnectionRequest.findByIdAndUpdate(
        reqId,
        { status },
        {
          runValidators: true,
        }
      );
      res.send(`Connection Request ${status} successfully`);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
