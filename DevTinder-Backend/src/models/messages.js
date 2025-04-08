const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  seen: {
    type: Boolean,
    default: false,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  content: {
    type: String,
    trime: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
