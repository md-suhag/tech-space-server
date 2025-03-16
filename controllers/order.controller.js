const { default: axios } = require("axios");
const { ssl_commerz, site_url } = require("../config");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const Product = require("../models/product.model");
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
const createOrder = catchAsync(async (req, res, next) => {
  const { orderItems, shippingAddress, userInfo, paymentInfo, totalPrice } =
    req.body;

  // Ensure order has items
  if (!orderItems || orderItems.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No order items provided" });
  }

  // Check stock & reduce quantity
  for (let item of orderItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return next(new AppError(`Product ${item.productId} not found`, 404));
    }
    if (product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${product.name}`, 404));
    }
    product.stock -= item.quantity;
    await product.save();
  }

  // Create OrderItems
  const createdOrderItems = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.productId);
      const total = item.quantity * product.price;

      const orderItem = await OrderItem.create({
        orderId: null,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        total,
      });

      return orderItem;
    })
  );

  //  Create Order
  const order = await Order.create({
    userId: req.user._id,
    orderItems: createdOrderItems.map((item) => item._id),
    shippingAddress,
    paymentInfo,
    totalPrice,
  });

  // Update OrderItems with the orderId
  await Promise.all(
    createdOrderItems.map((item) => {
      item.orderId = order._id;
      return item.save();
    })
  );
  const paymentData = {
    store_id: ssl_commerz.store_id,
    store_passwd: ssl_commerz.store_passwd,
    total_amount: order.totalPrice,
    currency: "BDT",
    tran_id: order._id.toString(), // Use order ID as the transaction ID
    success_url: `${site_url.server_url}/api/payment/success/${order._id}`,
    fail_url: `${site_url.server_url}/api/payment/fail/${order._id}`,
    cancel_url: `${site_url.server_url}/api/payment/cancel/${order._id}`,
    cus_name: userInfo.name,
    cus_email: userInfo.email,
    cus_add1: order.shippingAddress,
    cus_phone: userInfo.phone,
  };

  try {
    const response = await axios.post(ssl_commerz.api_url, paymentData);

    // If SSLCommerz payment request is successful
    if (response.data.status === "SUCCESS") {
      res
        .status(200)
        .json({ success: true, redirectUrl: response.data.payment_url });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment initiation failed" });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
});

module.exports = {
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  createOrder,
};
