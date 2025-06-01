const express = require("express");
const database = require("./models/database");
const database2 = require("./models/database2");
const cors = require("cors");

const app = express();

// ✅ Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ✅ Allow large JSON payloads (e.g. base64 images)
app.use(express.json({ limit: "10mb" }));

// ==========================
// ROUTES FOR MODEL 1
// ==========================

// 🔽 Save prediction for Model 1
app.post("/api/database1", async (req, res) => {
  console.log("📩 Model 1 Incoming Data:", req.body);

  try {
    const newEntry = await database.create({
      CorrectLabel: req.body.label,
      image: req.body.img,
    });

    res.status(201).json({
      status: "success",
      data: newEntry,
    });
  } catch (error) {
    console.error("❌ Model 1 Save Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 🔼 Get all predictions for Model 1
app.get("/api/database1", async (req, res) => {
  try {
    const data = await database.find().sort({ _id: -1 });
    res.status(200).json({ data: data });
  } catch (error) {
    console.error("❌ Model 1 Fetch Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ==========================
// ROUTES FOR MODEL 2
// ==========================

// 🔽 Save prediction for Model 2
app.post("/api/database2", async (req, res) => {
  console.log("📩 Model 2 Incoming Data:", req.body);

  try {
    const newEntry = await database2.create({
      CorrectLabel: req.body.label,
      image: req.body.img,
    });

    res.status(201).json({
      status: "success",
      data: newEntry,
    });
  } catch (error) {
    console.error("❌ Model 2 Save Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 🔼 Get all predictions for Model 2
app.get("/api/database2", async (req, res) => {
  try {
    const data = await database2.find().sort({ _id: -1 });
    res.status(200).json({ data: data });
  } catch (error) {
    console.error("❌ Model 2 Fetch Error:", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = app;
