const express = require('express');
const connect = require('./database/db')
const route = require('./routes/routes')
const cors = require("cors");
const model = require('./model/model');
const app = express();
const csv = require("csv-parser");
const multer = require("multer");
const fs = require("fs");


require('dotenv').config();
app.use(express.json())
app.use(cors())
const upload = multer({ dest: "uploads/" });

const Port = process.env.PORT  || 5000

app.use(cors())

app.get('/',async (req,res)=>{
  res.send("Welcome done")
})

app.use("/api",route)


app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const results = [];
    const filePath = req.file.path;

    // Parse CSV and convert it to JSON
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        // Clear old data and insert the new CSV data
        await model.deleteMany(); // Clear old data
        await model.insertMany(results); // Insert new data
        fs.unlinkSync(filePath); // Delete the file after processing

        res.json({ message: "CSV data uploaded and saved successfully!" });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(Port,async()=>{
  console.log("Listing to" , Port );
  try {
    await connect;
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
})

