const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const streamifier = require("streamifier");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { verifyToken, restrictTo } = require("../middlewares/auth");
const { upload, cloudinary } = require("../config/cloudinaryConfig");
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const oAuthClient = new OAuth2Client({
  client_id: CLIENT_ID,
});

function jwt_cookie(email, name, sub, res, role) {
  const Jwt = jwt.sign(
    {
      username: name,
      email: email,
      googleId: sub,
      role: role || "pending",
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" },
  );
  res.cookie("token", Jwt, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false, // Only sent over HTTPS
    sameSite: "lax", //csrf attack prevent
  });
}

router.post("/google/sign-in", async (req, res) => {
  const { credential } = req.body;
  console.log(credential);
  try {
    const ticket = await oAuthClient.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });

    // FIX 1: Grab the values correctly from the ticket payload object
    const payload = ticket.getPayload();
    const { name, picture, email, sub } = payload;

    const user = await userModel.findOne({
      googleId: sub,
    });

    //user with google already exist so allow login
    if (user) {
      jwt_cookie(user.email, user.username, user.googleId, res, user.role);
      return res.status(200).json({
        message: "user logged in successfully",
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
          id: user._id,
        },
      });
    }

    //user with google login doesnt exist but check if it has normal email login already
    const userWithEmailLogin = await userModel.findOne({ email });
    if (userWithEmailLogin) {
      userWithEmailLogin.googleId = sub;

      // FIX 2: Save the user document after updating the googleId field
      await userWithEmailLogin.save();

      jwt_cookie(
        userWithEmailLogin.email,
        userWithEmailLogin.name,
        userWithEmailLogin.googleId,
        res,
        userWithEmailLogin.role,
      );
      return res.status(200).json({
        message: "user logged in successfully",
        user: {
          username: userWithEmailLogin.username,
          email: userWithEmailLogin.email,
          role: userWithEmailLogin.role,
          id: userWithEmailLogin._id,
        },
      });
    }

    // new google signup user
    const newUser = new userModel({
      username: name,
      email,
      googleId: sub,
    });

    const savedNewUser = await newUser.save();
    jwt_cookie(email, name, sub, res);
    return res.status(200).json({
      message: "user signed up successfully",
      user: {
        username: savedNewUser.username,
        email: savedNewUser.email,
        role: savedNewUser.role,
        id: savedNewUser._id,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "user signup failed" });
  }
});

router.post(
  "/onboarding",
  verifyToken,
  upload.fields([
    { name: "identityDocument", maxCount: 1 },
    { name: "profileImg", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { phoneNumber, role } = req.body;

      const identityDocument = req.files?.identityDocument?.[0];
      const profileImg = req.files?.profileImg?.[0];

      // Cloudinary writeable upload stream
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "guide-nepal-images" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );
          streamifier.createReadStream(buffer).pipe(uploadStream);
        });
      };

      const updateData = {};

      if (phoneNumber) updateData.phone = phoneNumber;
      if (role) {
        updateData.role = role;
        if (role === "guide") {
          updateData["guideProfile.verificationStatus"] = "pending";
          updateData.isActive = false;
        }
      }

      // Handle identity document upload
      if (identityDocument) {
        const idResult = await streamUpload(identityDocument.buffer);
        updateData.citizenshipDoc = {
          url: idResult.secure_url,
          publicId: idResult.public_id,
          format: idResult.format,
          altText: `${req.user.username || "User"}'s Citizenship Document`,
        };
      }

      // Handle profile image upload
      if (profileImg) {
        const profileResult = await streamUpload(profileImg.buffer);
        updateData.profileImg = {
          url: profileResult.secure_url,
          publicId: profileResult.public_id,
          format: profileResult.format,
          altText: `${req.user.username || "User"}'s Profile Image`,
        };
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      jwt_cookie(
        updatedUser.email,
        updatedUser.username,
        updatedUser.googleId,
        res,
        updatedUser.role,
      );
      return res.status(200).json({
        message: "User onboarding record updated successfully",
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          id: updatedUser._id,
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Internal server error, could not update data",
        error: e.message,
      });
    }
  },
);
router.get("/me", verifyToken, (req, res) => {
  console.log("hi from /me route", req.user);
  const {
    email,
    _id,
    role,
    username,
    citizenshipDoc,
    profileImg,
    phone,
    isActive,
    guideProfile,
  } = req.user;
  return res.json({
    message: "hi from /me route ",
    user: {
      email,
      id: _id,
      role,
      username,
      verificationDocument: citizenshipDoc?.url || "",
      profileImg: profileImg?.url || "",
      phone: phone,
      isActive,
      verificationStatus: guideProfile?.verificationStatus,
    },
  });
});
router.get("/users", verifyToken, restrictTo("admin"), async (req, res) => {
  try {
    // Exclude password field
    const users = await userModel
      .find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});
module.exports = router;
