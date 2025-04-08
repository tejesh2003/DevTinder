const express = require("express");
const ConnectDb = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

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
    app.listen(7777, () => {
      console.log("server is running on port 7777");
    });
  })
  .catch(() => {
    console.log("Error connecting to Database");
  });
