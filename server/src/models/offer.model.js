const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "travel_request",
      required: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

offerSchema.index({ request: 1, guide: 1 }, { unique: true });
module.exports = mongoose.model("offer", offerSchema);
