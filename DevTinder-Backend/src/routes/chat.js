const express = require("express");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

//A particualr chat
chatRouter.get("/chat/:id", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const chatId = req.params.id;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//All chats List
chatRouter.get("/chats", userAuth, async (req, res) => {
  try {
    const user = req.user;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
