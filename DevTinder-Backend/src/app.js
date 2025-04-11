const express = require("express");
const ConnectDb = require("./config/database.js");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
const cookieParser = require("cookie-parser");
const cors = require("cors");

const users = [];

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const chatRouter = require("./routes/chat.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

ConnectDb()
  .then(() => {
    console.log("Connected to Database");
    io.on("connection", (socket) => {
      console.log(`a user connected ${socket.id}`);

      socket.on("register", (userId) => {
        console.log("register event");
        const existingUserIndex = users.findIndex(
          (user) => user.userId.toString() === userId.toString()
        );
        console.log("prev user...", existingUserIndex);

        if (existingUserIndex !== -1) {
          console.log("prev user...");
          users[existingUserIndex].socketId = socket.id;
        } else {
          users.push({ userId, socketId: socket.id });
        }
        console.log("Current users:", users);
      });

      console.log("Current users:", users);
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });

      socket.on("chat message", ({ content, receiverId }) => {
        const receiverSocketId = users.find(
          (user) => user.userId.toString() === receiverId.toString()
        ).socketId;

        console.log("receiverSocketId", receiverSocketId);
        console.log("content", content);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive message", {
            content,
            receiverId,
          });
          console.log(
            `Message sent to ${receiverId}, ${receiverSocketId}:`,
            content
          );
        } else {
          console.log(`User ${receiverId} not connected`);
        }
      });
    });
    server.listen(7777, () => {
      console.log("server is running on port 7777");
    });
  })
  .catch(() => {
    console.log("Error connecting to Database");
  });
