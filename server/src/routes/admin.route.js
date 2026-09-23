const express = require("express");
const router = express.Router();
const { verifyToken, restrictTo } = require("../middlewares/auth");
const User = require("../models/user.model");

router.get(
  "/verifications",
  verifyToken,
  restrictTo("admin"),
  async (req, res) => {
    const guides = await User.find({ role: "guide" })
      .select(
        "username email phone citizenshipDoc profileImg guideProfile isActive createdAt",
      )
      .sort({ "guideProfile.verificationStatus": 1, createdAt: 1 });
    res.json({ guides });
  },
);

router.patch(
  "/verifications/:guideId",
  verifyToken,
  restrictTo("admin"),
  async (req, res) => {
    const { status } = req.body;
    if (!["verified", "rejected"].includes(status))
      return res
        .status(400)
        .json({ message: "Status must be verified or rejected" });
    const guide = await User.findOneAndUpdate(
      { _id: req.params.guideId, role: "guide" },
      {
        $set: {
          "guideProfile.verificationStatus": status,
          isActive: false,
        },
      },
      { new: true },
    ).select("username email guideProfile isActive citizenshipDoc profileImg");
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.json({ message: `Guide ${status}`, guide });
  },
);

router.patch(
  "/users/:userId/active",
  verifyToken,
  restrictTo("admin"),
  async (req, res) => {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" });
    }
    const guide = await User.findOneAndUpdate(
      {
        _id: req.params.userId,
        role: "guide",
        ...(isActive ? { "guideProfile.verificationStatus": "verified" } : {}),
      },
      { $set: { isActive } },
      { new: true },
    ).select("username email role isActive guideProfile");
    if (!guide) return res.status(404).json({ message: "Guide not found" });
    res.json({
      message: `Guide ${isActive ? "activated" : "deactivated"}`,
      guide,
    });
  },
);

module.exports = router;
