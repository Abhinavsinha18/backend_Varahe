const express = require('express');
const connectDB = require('./database/db'); // Changed 'connect' to 'connectDB' for clarity
const route = require('./routes/routes');
const cors = require("cors");
const model = require('./model/model');
const app = express();
const csv = require("csv-parser");
const multer = require("multer");
const fs = require("fs");

require('dotenv').config();
app.use(express.json());
app.use(cors()); // You have app.use(cors()) twice, one is enough.
const upload = multer({ dest: "uploads/" });

const Port = process.env.PORT || 5001;

// Removed app.use(cors()) from here as it's already above

app.get('/', async (req, res) => {
  res.send("Welcome done");
});

app.use("/api", route);

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
        try { // Add try-catch for async operations within 'end'
          // Filter out rows that don't have all required fields
          const validResults = results.filter(row => {
            return row["Project Name"] && String(row["Project Name"]).trim() !== "" &&
                   row["Team Code"] && String(row["Team Code"]).trim() !== "" &&
                   row["Employee Code"] && String(row["Employee Code"]).trim() !== "" &&
                   row["Employee name"] && String(row["Employee name"]).trim() !== "" &&
                   row["Designation"] && String(row["Designation"]).trim() !== "" &&
                   row["Blood Group"] && String(row["Blood Group"]).trim() !== "" &&
                   row["Image Link"] && String(row["Image Link"]).trim() !== "";
          });

          if (validResults.length === 0 && results.length > 0) {
            // All rows were invalid, or only headers were present
             fs.unlinkSync(filePath); // Delete the file
             if (!res.headersSent) {
                return res.status(400).json({ error: "No valid data rows found in CSV." });
             }
             return; // Exit if headers already sent or response handled
          }


          await model.deleteMany(); // Clear old data
          await model.insertMany(validResults); // Insert new, valid data
          fs.unlinkSync(filePath); // Delete the file after processing

          // Send the uploaded data as part of the response
          if (!res.headersSent) {
            res.json({
              message: "CSV data uploaded and saved successfully!",
              data: validResults, // Send the filtered valid data in the response
            });
          }
        } catch (dbError) {
          console.error("Database operation error during upload:", dbError);
          if (fs.existsSync(filePath)) { // Check if file exists before unlinking
            fs.unlinkSync(filePath); // Attempt to clean up
          }
          if (!res.headersSent) {
            res.status(500).json({ error: "Database operation failed: " + dbError.message });
          }
        }
      })
      .on("error", (streamError) => { // Add this error handler for the stream
        console.error("File Stream Error:", streamError);
        if (fs.existsSync(filePath)) { // Check if file exists before unlinking
           fs.unlinkSync(filePath); // Clean up uploaded file
        }
        if (!res.headersSent) {
          res.status(500).json({ error: "Error processing file: " + streamError.message });
        }
      });
  } catch (error) {
    // This outer catch handles errors like req.file not existing or initial setup errors
    console.error("Outer catch error in /upload:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

app.get("/get-all-items", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100; // Default limit to 100, adjustable via query param
    const skip = (page - 1) * limit;

    const items = await model.find()
                             .skip(skip)
                             .limit(limit)
                             .maxTimeMS(30000); // Keep or increase timeout

    const totalItems = await model.countDocuments(); // Get total count for pagination info

    if (!items?.length && page === 1) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json({
      message: "All items retrieved successfully",
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      countInPage: items.length,
      totalCount: totalItems,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      error: `Database error: ${error.message}`,
      solution: "Ensure relevant fields are indexed. Try reducing the 'limit' query parameter or increasing maxTimeMS further if needed."
    });
  }
});

// Start server function
async function startServer() {
  try {
    await connectDB(); // Connect to MongoDB
    // connectDB handles its own logging and process.exit on error
    app.listen(Port, () => {
      console.log(`Server listening on port ${Port}`);
    });
  } catch (error) {
    // This catch might be redundant if connectDB always exits on error, but good for safety.
    console.error("Failed to start the server due to MongoDB connection issue:", error);
    process.exit(1);
  }
}

startServer(); // Call the function to start the server

