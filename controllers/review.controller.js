const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const Product = require("../models/product.model");
const Review = require("../models/review.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createReview = catchAsync(async (req, res, next) => {
  const { orderItemId, productId, rating, comment } = req.body;
  const userId = req.user._id;

  // Validate order ownership
  const orderItem = await OrderItem.findOne({ _id: orderItemId, productId });
  if (!orderItem) {
    return next(new AppError("Order item not found", 400));
  }

  const order = await Order.findOne({ _id: orderItem.orderId, userId });
  if (!order) {
    return next(
      new AppError("You are not authorized to review this product", 403)
    );
  }
  if (
    order.orderStatus !== "Delivered" ||
    order.paymentInfo.status !== "Paid"
  ) {
    return next(
      new AppError(
        "You can only provide review after paying product price and delivered"
      )
    );
  }

  // Check if the user already reviewed this product
  const existingReview = await Review.findOne({
    user: userId,
    orderItem: orderItemId,
  });
  if (existingReview) {
    return next(new AppError("You have already reviewed this product", 400));
  }

  // Create new review
  const review = await Review.create({
    user: userId,
    product: productId,
    orderItem: orderItemId,
    rating,
    comment,
  });

  // Update product rating
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  product.reviewCount += 1;
  product.totalRating += rating;

  await product.save();

  res
    .status(201)
    .json({ success: true, message: "Review submitted successfully", review });
});
const getProductReviews = catchAsync(async (req, res, next) => {});

module.exports = {
  createReview,
  getProductReviews,
};
