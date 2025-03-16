const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =========== register new user ==========
const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existUser = await User.findOne({ email });

  if (existUser) {
    return next(new AppError("User already exists", 409));
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  await User.create({
    name,
    email,
    password: hashPassword,
  });
  res.status(201).json({
    success: true,
    message: "Registration successfull",
  });
});

// =========== login ==========
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("Invalid email or password", 400));
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid email or password", 400));
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
  });
});

module.exports = {
  register,
  login,
};
