const app = require("./App");
const mongoose = require("mongoose");
require("dotenv").config();

const DB = process.env.MONGO_URI;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
});

app.listen(3001, () => {
  console.log("Server listening on http://localhost:3001");
});
