require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.get("/", async (req, res) => {
  if (!MONGO_URI) {
    return res.status(500).json({
      status: "error",
      message: "MongoDB URI is missing from environment variables.",
    });
  }

  try {
    const state = mongoose.connection.readyState;

    if (state === 1) {
      return res.status(200).json({
        status: "success",
        message: "MongoDB is already connected.",
      });
    }

    if (state === 2) {
      return res.status(202).json({
        status: "pending",
        message:
          "MongoDB is currently establishing a connection. Please try again.",
      });
    }

    // Attempting secure connection
    await mongoose.connect(MONGO_URI);

    return res.status(200).json({
      status: "success",
      message: "Secure MongoDB connection established successfully!",
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to establish connection to MongoDB.",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running safely on http://localhost:${PORT}`);
});
