const mongoose = require("mongoose");

const data2Schema = new mongoose.Schema({
  CorrectLabel: {
    type: String,
    required: [true, "Enter Correct Label"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Upload image"],
  },
}, { timestamps: true }); // ✅ Adds createdAt and updatedAt fields automatically

const database2 = mongoose.model("database2", data2Schema);
module.exports = database2;
