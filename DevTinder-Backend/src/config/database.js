const mongoose = require("mongoose");
require("dotenv").config();
// const dbURI = process.env.DB_STRING;

const ConnectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://tejesh:Tejesh%406328@cluster0.eqdpg.mongodb.net/DevTinder"
  );
};

module.exports = ConnectDb;
