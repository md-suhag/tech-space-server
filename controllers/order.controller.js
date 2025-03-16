const Order = require("../models/order.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// =========== get all orders ==========
const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({});

  if (orders.length) {
    return next(new AppError("No order found", 404));
  }

  res.status(200).json({
    success: true,
    message: "All orders featched successfully",
    data: orders,
  });
});

// =========== get details of a order ==========
const getSingleOrder = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  const order = await Order.findOne({ _id: id });

  if (!order) {
    return next(new AppError("No order found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Order featched successfully",
    data: order,
  });
});

// =========== update order status ==========
const updateOrderStatus = catchAsync(async (req, res, next) => {});

// =========== create new order ==========
const createOrder = catchAsync(async (req, res, next) => {});

module.exports = {
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  createOrder,
};
