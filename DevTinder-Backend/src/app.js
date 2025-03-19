const express = require("express");
const ConnectDb = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
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

//send connection request

// //get user
// app.get("/user", async (req, res) => {
//   try {
//     const data = await req.body;
//     const user = await User.findOne(data);
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("Error in fetching user" + err.message);
//   }
// });
// //delete the user

// app.delete("/user/:userId", async (req, res) => {
//   try {
//     const userId = req.params?.userId;
//     if (userId) {
//       await User.findByIdAndDelete(userId);
//       res.send("Deleted the User");
//     } else {
//       res.status(404).send("User not found");
//     }
//   } catch (err) {
//     res.status(400).send("Error in deleting user" + err.message);
//   }
// });

// //update the user
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = await req.body;
//   try {
//     const ALLOWED_FIELDS = ["photoUrl", "about", "skills"];
//     const isUpdateAllowed = Object.keys(data).every((key) =>
//       ALLOWED_FIELDS.includes(key)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Invalid update fields");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("Max number of skills are 10");
//     }
//     await User.findByIdAndUpdate(userId, data, { runValidators: true });
//     res.send("Updated the user");
//   } catch (err) {
//     res.status(400).send("Error in updating user:" + err.message);
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
