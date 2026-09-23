const mongoose = require("mongoose");
const seedAdmin = require("./seed.js");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Database connected!");
    seedAdmin();
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
};

module.exports = connectDB;
