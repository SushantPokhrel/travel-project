const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./config/database");
const UserRoutes = require("./routes/user.route");
const TravelRoutes = require("./routes/travel.route");
const AdminRoutes = require("./routes/admin.route");
const { verifyToken } = require("./middlewares/auth");
db();
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", UserRoutes);
app.use("/api/travel", TravelRoutes);
app.use("/api/admin", AdminRoutes);
app.get("/", verifyToken, (req, res) => {
  res.json("hi from server");
});

module.exports = app;
