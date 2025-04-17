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
    if (!content || content.length === 0) {
      throw new Error("Content is required");
    }
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
    if (existingChat.user1.toString() === user._id.toString()) {
      existingChat.unseen_2 = (existingChat.unseen_2 || 0) + 1;
    } else {
      existingChat.unseen_1 = (existingChat.unseen_1 || 0) + 1;
    }
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
    const chatList = await chat
      .find({
        $or: [{ user1: user._id }, { user2: user._id }],
      })
      .populate("user1", SAFE_DATA)
      .populate("user2", SAFE_DATA)
      .populate("latestMessage", "content sender createdAt");
    const newChatList = chatList.map((chat) => {
      const chatUser =
        chat.user1._id.toString() === user._id.toString()
          ? chat.user2
          : chat.user1;
      const unseen =
        chat.user1._id.toString() === user._id.toString()
          ? chat.unseen_1
          : chat.unseen_2;
      return {
        user: chatUser,
        unseen: unseen,
        latestMessage: chat.latestMessage,
      };
    });
    res.send(newChatList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//clear unseen

chatRouter.post("/clearunseen/:id", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const receiverId = req.params.id;
    const clearChat = await chat.findOne({
      $or: [
        { user1: userId, user2: receiverId },
        { user1: receiverId, user2: userId },
      ],
    });
    if (clearChat) {
      if (clearChat.user1.toString() === userId.toString()) {
        clearChat.unseen_1 = 0;
        // console.log("clearChat.unseen_1", clearChat.unseen_1);
      } else {
        clearChat.unseen_2 = 0;
        // console.log("clearChat.unseen_2", clearChat.unseen_2);
      }
    }
    // console.log("unseen", clearChat.unseen_1);
    // console.log("unseen", clearChat.unseen_2);
    await clearChat.save();
    res.send("Unseen messages cleared");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//call a partiular chat

chatRouter.get("/latestmessage/:id", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const receiverId = req.params.id;

    const latestChat = await chat
      .findOne({
        $or: [
          { user1: userId, user2: receiverId },
          { user1: receiverId, user2: userId },
        ],
      })
      .populate("user1", SAFE_DATA)
      .populate("user2", SAFE_DATA)
      .populate("latestMessage", "content sender createdAt")
      .lean();

    if (!latestChat) {
      return res.status(404).json({ message: "No chat found" });
    }

    const otherUser =
      latestChat.user1._id.toString() === userId.toString()
        ? latestChat.user2
        : latestChat.user1;

    res.status(200).json({
      user: otherUser,
      latestMessage: latestChat.latestMessage,
    });
  } catch (err) {
    console.error("Error fetching latest message:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//All messages between 2 particular users

chatRouter.get("/messages/:id", userAuth, async (req, res) => {
  try {
    const limit = 20;
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const receiverId = req.params.id;
    const reqChat = await chat.findOne({
      $or: [
        { user1: user._id, user2: receiverId },
        { user1: receiverId, user2: user._id },
      ],
    });

    if (!reqChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const allMessages = await messages
      .find({ chatId: reqChat._id })
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);

    res.send(allMessages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//total unseen messages

chatRouter.get("/totalunseen", userAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const allChats = await chat.find({
      $or: [{ user1: userId }, { user2: userId }],
    });
    let unseen = 0;
    allChats.map((chat) => {
      chat.user1.toString() === userId
        ? (unseen += chat.unseen_1)
        : (unseen += chat.unseen_2);
    });
    res.send({ unseen });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = chatRouter;
