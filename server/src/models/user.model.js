const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
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
    citizenshipDoc: {
      url: {
        type: String,
        trim: true,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
        trim: true,
      },
      altText: {
        type: String,
        trim: true,
        default: "",
      },
      format: {
        type: String, // e.g., 'jpg', 'png', 'webp'
        default: "",
      },
    },
    profileImg: {
      url: {
        type: String,
        trim: true,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
        trim: true,
      },
      altText: {
        type: String,
        trim: true,
        default: "",
      },
      format: {
        type: String, // e.g., 'jpg', 'png', 'webp'
        default: "",
      },
    },
    guideProfile: {
      bio: { type: String, trim: true, default: "" },
      location: { type: String, trim: true, default: "" },
      languages: { type: [String], default: [] },
      specialties: { type: [String], default: [] },
      pricePerDay: { type: Number, min: 0 },
      verificationStatus: {
        type: String,
        enum: ["not_submitted", "pending", "verified", "rejected"],
        default: "not_submitted",
      },
      rating: { type: Number, min: 0, max: 5, default: 0 },
      reviewCount: { type: Number, min: 0, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("user", userSchema);
