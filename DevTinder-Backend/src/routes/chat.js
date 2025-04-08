const express = require("express");
const { userAuth } = require("../middlewares/auth");
const chat = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");
const messages = require("../models/messages");

const chatRouter = express.Router();

const SAFE_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "about",
  "skills",
  "photoUrl",
];
//Create Chat
chatRouter.post("/chat/:id", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { content } = req.body;
    const receiverId = req.params.id;
    const connection = await ConnectionRequestModel.find({
      $or: [
        { sender: receiverId, receiver: user._id, status: "accepted" },
        { sender: user._id, receiver: receiverId, status: "accepted" },
      ],
    })
      .populate("sender", SAFE_DATA)
      .populate("receiver", SAFE_DATA);

    if (!connection.length) {
      throw new Error("You are not connected with this user");
    }
    let existingChat = await chat.findOne({
      $or: [
        { user1: user._id, user2: receiverId },
        { user1: receiverId, user2: user._id },
      ],
    });
    if (!existingChat) {
      existingChat = new chat({
        user1: user._id,
        user2: receiverId,
      });
      await existingChat.save();
    }
    //send msg
    const Message = new messages({
      sender: user._id,
      chatId: existingChat._id,
      content: content,
    });
    await Message.save();
    //update chat
    existingChat.latestMessage = Message._id;
    await existingChat.save();
    res.send("Message sent succesfully");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//All chats List
chatRouter.get("/chats", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const chatList = await chat.find({
      $or: [{ user1: user._id }, { user2: user._id }],
    });
    res.send(chatList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//All messages between 2 particular users

chatRouter.get("/messages/:id", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const receiverId = req.params.id;
    const reqChat = await chat.findOne({
      $or: [
        { user1: user._id, user2: receiverId },
        { user1: receiverId, user2: user._id },
      ],
    });
    const allMessages = await messages
      .find({ chatId: reqChat._id })
      .sort({ createdAt: -1 });
    res.send(allMessages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = chatRouter;
