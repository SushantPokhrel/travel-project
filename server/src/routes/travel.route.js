const express = require("express");
const router = express.Router();
const { verifyToken, restrictTo } = require("../middlewares/auth");
const User = require("../models/user.model");
const TravelRequest = require("../models/travel-request.model");
const Offer = require("../models/offer.model");
const Booking = require("../models/booking.model");
const Review = require("../models/review.model");

const sameId = (value, id) => value?.toString() === id.toString();
const withUsers = (query) =>
  query
    .populate("tourist", "username email profileImg")
    .populate("guide", "username email profileImg guideProfile");

router.get("/guides", async (req, res) => {
  const guides = await User.find({
    role: "guide",
    isActive: true,
    "guideProfile.verificationStatus": "verified",
  })
    .select("username email phone profileImg guideProfile")
    .sort({ "guideProfile.rating": -1 });
  res.json({ guides });
});

router.post(
  "/guide-profile",
  verifyToken,
  restrictTo("guide"),
  async (req, res) => {
    const {
      bio,
      location,
      languages = [],
      specialties = [],
      pricePerDay,
    } = req.body;
    const guide = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          guideProfile: {
            bio,
            location,
            languages,
            specialties,
            pricePerDay,
            verificationStatus: "pending",
          },
          isActive: false,
        },
      },
      { new: true, runValidators: true },
    ).select("username email profileImg guideProfile");
    res.json({ message: "Guide profile submitted for verification", guide });
  },
);

router.get("/requests", verifyToken, async (req, res) => {
  const filter =
    req.user.role === "tourist"
      ? { tourist: req.user._id }
      : { status: { $in: ["open", "offered"] } };
  const requests = await withUsers(
    TravelRequest.find(filter).sort({ createdAt: -1 }),
  );
  res.json({ requests });
});

router.post(
  "/requests",
  verifyToken,
  restrictTo("tourist"),
  async (req, res) => {
    const { destination, startDate, endDate, travelers, budget, details } =
      req.body;
    if (!destination || !startDate || !endDate || !travelers)
      return res
        .status(400)
        .json({ message: "Destination, dates, and travelers are required" });
    if (new Date(endDate) < new Date(startDate))
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    const request = await TravelRequest.create({
      tourist: req.user._id,
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      details,
    });
    res.status(201).json({ request });
  },
);

router.get("/offers", verifyToken, async (req, res) => {
  const filter =
    req.user.role === "guide"
      ? { guide: req.user._id }
      : { tourist: req.user._id };
  const offers = await Offer.find(filter)
    .populate({
      path: "request",
      populate: { path: "tourist", select: "username email" },
    })
    .populate("guide", "username email profileImg guideProfile")
    .sort({ createdAt: -1 });
  res.json({ offers });
});

router.post(
  "/requests/:requestId/offers",
  verifyToken,
  restrictTo("guide"),
  async (req, res) => {
    const guide = await User.findById(req.user._id);
    if (guide.guideProfile?.verificationStatus !== "verified")
      return res
        .status(403)
        .json({ message: "Your guide profile must be verified first" });
    const request = await TravelRequest.findById(req.params.requestId);
    if (!request || !["open", "offered"].includes(request.status))
      return res.status(404).json({ message: "Open request not found" });
    const { price, message } = req.body;
    if (price === undefined)
      return res.status(400).json({ message: "Offer price is required" });
    try {
      const offer = await Offer.create({
        request: request._id,
        guide: req.user._id,
        price,
        message,
      });
      request.status = "offered";
      await request.save();
      res.status(201).json({ offer });
    } catch (error) {
      if (error.code === 11000)
        return res
          .status(409)
          .json({ message: "You already offered on this request" });
      throw error;
    }
  },
);

router.post(
  "/offers/:offerId/accept",
  verifyToken,
  restrictTo("tourist"),
  async (req, res) => {
    const offer = await Offer.findById(req.params.offerId).populate("request");
    if (
      !offer ||
      !sameId(offer.request.tourist, req.user._id) ||
      offer.status !== "pending"
    )
      return res
        .status(404)
        .json({ message: "Offer not found or no longer available" });
    const booking = await Booking.create({
      request: offer.request._id,
      offer: offer._id,
      tourist: req.user._id,
      guide: offer.guide,
      amount: offer.price,
    });
    await Offer.updateMany(
      { request: offer.request._id, _id: { $ne: offer._id } },
      { $set: { status: "rejected" } },
    );
    offer.status = "accepted";
    await offer.save();
    await TravelRequest.findByIdAndUpdate(offer.request._id, {
      status: "booked",
      guide: offer.guide,
    });
    res.status(201).json({ booking });
  },
);

router.get("/bookings", verifyToken, async (req, res) => {
  const filter =
    req.user.role === "guide"
      ? { guide: req.user._id }
      : { tourist: req.user._id };
  const bookings = await Booking.find(filter)
    .populate("request")
    .populate("guide", "username email profileImg guideProfile")
    .populate("tourist", "username email")
    .sort({ createdAt: -1 });
  res.json({ bookings });
});

router.post(
  "/bookings/:bookingId/pay",
  verifyToken,
  restrictTo("tourist"),
  async (req, res) => {
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.bookingId,
        tourist: req.user._id,
        status: "awaiting_payment",
      },
      { paymentStatus: "paid", status: "confirmed" },
      { new: true },
    );
    if (!booking)
      return res
        .status(404)
        .json({ message: "Payment is not available for this booking" });
    res.json({
      message: "Mock payment completed and booking confirmed",
      booking,
    });
  },
);

router.post(
  "/bookings/:bookingId/complete",
  verifyToken,
  restrictTo("guide"),
  async (req, res) => {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.bookingId, guide: req.user._id, status: "confirmed" },
      { status: "completed", completedAt: new Date() },
      { new: true },
    );
    if (!booking)
      return res.status(404).json({ message: "Confirmed booking not found" });
    await TravelRequest.findByIdAndUpdate(booking.request, {
      status: "completed",
    });
    res.json({ booking });
  },
);

router.post(
  "/bookings/:bookingId/review",
  verifyToken,
  restrictTo("tourist"),
  async (req, res) => {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      tourist: req.user._id,
      status: "completed",
    });
    if (!booking)
      return res
        .status(404)
        .json({ message: "Only completed trips can be reviewed" });
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    try {
      const review = await Review.create({
        booking: booking._id,
        tourist: req.user._id,
        guide: booking.guide,
        rating,
        comment,
      });
      const guide = await User.findById(booking.guide);
      const count = guide.guideProfile.reviewCount || 0;
      const current = guide.guideProfile.rating || 0;
      guide.guideProfile.rating =
        (current * count + Number(rating)) / (count + 1);
      guide.guideProfile.reviewCount = count + 1;
      await guide.save();
      res.status(201).json({
        review,
        rating: guide.guideProfile.rating,
        reviewCount: guide.guideProfile.reviewCount,
      });
    } catch (error) {
      if (error.code === 11000)
        return res
          .status(409)
          .json({ message: "This booking already has a review" });
      throw error;
    }
  },
);

module.exports = router;
