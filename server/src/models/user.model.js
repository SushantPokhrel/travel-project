const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
  },
  email: { type: String, required: true, unique: true, trim: true },
  role: {
    type: String,
    enum: ["tourist", "admin", "guide", "pending"],
    default: "pending",
  },
  googleId: { type: String, unique: true },
  isActive: {
    type: Boolean,
    default: true, // New users are active by default
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("user", userSchema);
