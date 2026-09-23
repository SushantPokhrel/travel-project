const mongoose = require("mongoose");

const travelRequestSchema = new mongoose.Schema(
  {
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    destination: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelers: { type: Number, required: true, min: 1 },
    budget: { type: Number, min: 0 },
    details: { type: String, trim: true },
    status: {
      type: String,
      enum: ["open", "offered", "booked", "completed", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("travel_request", travelRequestSchema);
