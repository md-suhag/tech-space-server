const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const auth = (...roles) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies["token"];

    if (!token) {
      return next(new AppError("You are not authorized", 403));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (roles.length && !roles.includes(req.user.role)) {
      return next(new AppError("You are not authorized", 403));
    }

    next();
  });
};

module.exports = { auth };
