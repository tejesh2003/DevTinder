const express = require("express");
const ConnectDb = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth.js");

app.use(cookieParser());
app.use(express.json());

//user signup
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, skills, emailId, about, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      about,
      password: passwordHash,
    });

    await user.save();
    res.send("User created");
  } catch (err) {
    res.status(400).send("Error in creating user" + err.message);
  }
});

//login user
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");
    const passwordHash = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    } else {
      const token = jwt.sign({ _id: user._id }, "TinderofDevelopers", {
        expiresIn: "1d",
      });
      res.cookie("token", token);
      res.send("Login Successful");
    }
  } catch (err) {
    res.status(400).send("Error in login: " + err.message);
  }
});

//get user profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error in fetching profile " + err.message);
  }
});

//get all feed
app.get("/feed", async (req, res) => {
  try {
    const feed = await User.find();
    if (feed.length === 0) res.status(404).send("No feed available");
    res.send(feed);
  } catch (err) {
    res.status(400).send("Error in fetching feed" + err.message);
  }
});

//send connection request

//logout user
// app.post("/logout",async(req,res)=>{
//   try {
//     res.clearCookie("token");
//   }catch(err){
//     res.status(400).send("Error in logout: " + err.message);
//   }
// })
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
