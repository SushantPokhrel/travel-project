const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "travel_request",
      required: true,
      unique: true,
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "offer",
      required: true,
    },
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["awaiting_payment", "confirmed", "completed"],
      default: "awaiting_payment",
    },
    completedAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("booking", bookingSchema);
