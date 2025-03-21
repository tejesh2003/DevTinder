const express = require("express");
const ConnectDb = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

//get all feed
// app.get("/feed", async (req, res) => {
//   try {
//     const feed = await User.find();
//     if (feed.length === 0) res.status(404).send("No feed available");
//     res.send(feed);
//   } catch (err) {
//     res.status(400).send("Error in fetching feed" + err.message);
//   }
// });

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
