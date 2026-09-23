const User = require("../models/user.model");
require("dotenv").config({
  path: ".env.development",
});
const seedUsers = async () => {
  const adminCount = await User.countDocuments({ role: "admin" });
  if (adminCount == 1) {
    return;
  }
  const insertedUser = await User.insertOne({
    username: "sushant pokhrel",
    email: "pokhrel00007@gmail.com",
    phone: "9767393911",
    role: "admin",
    password: process.env.ADMIN_PASSWORD,
  });
  console.log(insertedUser);
};
module.exports = seedUsers;
