const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://abhinav:abhinav@idcard.ivxc7.mongodb.net/?retryWrites=true&w=majority&appName=Idcard");
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
