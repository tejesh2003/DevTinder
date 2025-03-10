const mongoose = require("mongoose");
require('dotenv').config();
const dbURI = process.env.DB_STRING;

const ConnectDb = async () =>{
    await mongoose.connect(dbURI);
};

module.exports = ConnectDb;