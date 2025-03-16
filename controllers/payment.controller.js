const Order = require("../models/order.model");
const catchAsync = require("../utils/catchAsync");
const verifyPayment = require("../utils/verifyPayment");

// =========== handle payment success ==========
const handlePaymentSuccess = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const paymentData = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError("No order found", 404));
  }

  // Verify payment using the paymentData (from SSLCommerz callback)
  const isValidPayment = await verifyPayment(paymentData);

  if (isValidPayment) {
    order.paymentInfo.status = "Paid";
    order.paymentInfo.transactionId = paymentData.tran_id;
    order.orderStatus = "Shipped";
    await order.save();

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Payment successful. Your order is being processed.",
    });
  } else {
    res.status(400).json({ success: false, message: "Invalid payment" });
  }
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

  res
    .status(400)
    .json({ success: false, message: "Payment failed. Please try again." });
});

// =========== handle payment cancel ==========
const handlePaymentCancel = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError("No order found", 404));
  }

  order.paymentInfo.status = "Cancelled";
  await order.save();

  res.status(400).json({
    success: false,
    message: "Payment cancelled. Your order has been cancelled.",
  });
});

module.exports = {
  handlePaymentSuccess,
  handlePaymentFail,
  handlePaymentCancel,
};
