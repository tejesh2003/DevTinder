const express = require("express");
const ConnectDb = require("./config/database.js")
const app = express();
const User= require("./models/user.js");

app.post("/signup",async(req,res)=>{
  const user= new User({
    firstName:"Tejesh",
    lastName:"Chintada",
    emailId:"tejesh@gmail.com",
    password:"tejesh123",
  })
  try {
    await user.save();
    res.send("User created");
  }catch{
    res.send("Error in creating user");
  }
})

ConnectDb()
.then(()=>{
  console.log("Connected to Database");
  app.listen(7777, () => {
    console.log("server is running on port 7777");
  });
})
.catch(()=>{
  console.log("Error connecting to Database");
})
