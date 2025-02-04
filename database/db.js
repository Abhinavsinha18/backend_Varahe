const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();
let connect =  mongoose.connect("mongodb+srv://abhinav:abhinav@idcard.ivxc7.mongodb.net/?retryWrites=true&w=majority&appName=Idcard",{ useNewUrlParser: true, useUnifiedTopology: true });
module.exports = connect;
