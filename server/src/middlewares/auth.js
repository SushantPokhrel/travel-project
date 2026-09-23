const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const verifyToken = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const token = req.cookies.token;
    // console.log(token)
    if (!token) return res.status(401).json({ message: "unauthorized access" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);
    //current user from db
    const currentUser = await userModel.findOne({ googleId: decoded.googleId });
    if (!currentUser) {
      return res.status(401).json({ message: "User account not found" });
    }
    const canAccessWhileAwaitingVerification =
      currentUser.role === "guide" &&
      ["pending", "rejected"].includes(
        currentUser.guideProfile?.verificationStatus,
      );
    if (!currentUser.isActive && !canAccessWhileAwaitingVerification) {
      return res.status(403).json({
        message:
          "Your account has been suspended or deactivated. Please contact an administrator.",
      });
    }
    req.user = currentUser;
    return next();
  } catch (e) {
    console.log(e);
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (e.name === "JsonWebTokenError") {
      return res
        .status(403)
        .json({ message: "Forbidden access, Invalid token" });
    } else {
      return res.status(403).json({ message: "Token verification failed" });
    }
  }
};
const restrictTo = (...roles) => {
  roles.forEach((r) => console.log(r));
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "cannot access this resource" });
    return next();
  };
};
module.exports = { verifyToken, restrictTo };
