const config = require("../config");
const Order = require("../models/order.model");
const catchAsync = require("../utils/catchAsync");

// =========== handle payment success ==========
const handlePaymentSuccess = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError("No order found", 404));
  }

  order.paymentInfo.status = "Paid";
  order.paymentInfo.transactionId = orderId;
  order.orderStatus = "Shipped";
  await order.save();

  res.redirect(`${config.site_url.client_url}/payment/success/${order._id}`);
});

// =========== handle payment fail ==========
const handlePaymentFail = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError("No order found", 404));
  }

  order.paymentInfo.status = "Failed";
  await order.save();

  res.redirect(`${config.site_url.client_url}/payment/fail/${order._id}`);
});

// =========== handle payment cancel ==========
const handlePaymentCancel = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError("No order found", 404));
  }

  order.orderStatus = "Cancelled";
  order.paymentInfo.status = "Failed";
  await order.save();

  res.redirect(`${config.site_url.client_url}/payment/cancel/${order._id}`);
});

module.exports = {
  handlePaymentSuccess,
  handlePaymentFail,
  handlePaymentCancel,
};
