const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  CorrectLabel: {
    type: String,
    required: [true, "Enter Correct Label"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Upload image"],
  },
}, { timestamps: true });

const database = mongoose.model("database1", dataSchema);
module.exports = database;
