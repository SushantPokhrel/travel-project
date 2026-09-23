const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { verifyToken } = require("../middlewares/auth");
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
    secure: true, // Only sent over HTTPS
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
router.get("/me", verifyToken, (req, res) => {
  console.log("hi from /me route", req.user);
  const { email, _id, role, username } = req.user;
  return res.json({
    message: "hi from /me route ",
    user: {
      email,
      id: _id,
      role,
      username,
    },
  });
});

module.exports = router;
