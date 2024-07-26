const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
let connect = mongoose.connect(process.env.MONGO_URL);
module.exports = connect;