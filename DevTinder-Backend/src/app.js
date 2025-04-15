const express = require("express");
const ConnectDb = require("./config/database.js");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

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
        if (!userId) {
          console.error(
            "Invalid userId received during socket registration:",
            userId
          );
          return;
        }
        const existingUserIndex = users.findIndex(
          (user) => user.userId.toString() === userId.toString()
        );
        if (existingUserIndex !== -1) {
          users[existingUserIndex].socketId = socket.id;
        } else {
          users.push({ userId, socketId: socket.id });
        }
      });

      socket.on("disconnect", () => {
        const index = users.findIndex((user) => user.socketId === socket.id);
        if (index !== -1) {
          users.splice(index, 1);
        }
      });

      socket.on("chat message", ({ content, receiverId }) => {
        const receiver = users.find(
          (user) => user.userId.toString() === receiverId.toString()
        );
        if (receiver && receiver.socketId) {
          io.to(receiver.socketId).emit("receive message", {
            content,
            receiverId,
          });
        } else {
          console.log(`Receiver with ID ${receiverId} is offline`);
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
