const { ssl_commerz, site_url } = require("../config");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const Product = require("../models/product.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const SSLCommerzPayment = require("sslcommerz-lts");

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

// =========== get all orders of a customer ==========
const getCustomerOrders = catchAsync(async (req, res, next) => {
  const customerId = req.user._id;

  const orders = await Order.find({ userId: customerId }).populate(
    "orderItems"
  );
  if (!orders.length) {
    return next(new AppError("No order found", 404));
  }
  res.status(200).json({
    success: true,
    message: "All orders fetched successfully",
    data: orders,
  });
});
// =========== update order status ==========
const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  // Ensure valid order status
  const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(orderStatus)) {
    return next(new AppError("Invalid order status", 400));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError("No order found", 404));
  }

  // Update order status
  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});

// =========== create new order ==========
const createOrder = catchAsync(async (req, res, next) => {
  const { orderItems, shippingAddress, userInfo, paymentInfo } = req.body;

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

  let totalOrderPrice = 0;
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
      totalOrderPrice += total;
      return orderItem;
    })
  );

  //  Create Order
  const order = await Order.create({
    userId: req.user._id,
    orderItems: createdOrderItems.map((item) => item._id),
    shippingAddress,
    paymentInfo,
    totalPrice: totalOrderPrice,
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
    shipping_method: "Courier",
    product_name: "electric-product",
    product_category: "electronics",
    product_profile: "general",
    cus_name: userInfo.name,
    cus_email: userInfo.email,
    cus_add1: order.shippingAddress,
    cus_city: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: userInfo.phone,
    ship_name: userInfo.name,
    ship_add1: order.shippingAddress,
    ship_add2: order.shippingAddress,
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  try {
    const sslcz = new SSLCommerzPayment(
      ssl_commerz.store_id,
      ssl_commerz.store_passwd,
      false
    );
    sslcz.init(paymentData).then((apiResponse) => {
      let GatewayPageURL = apiResponse.GatewayPageURL;

      res.status(200).json({ success: true, redirectUrl: GatewayPageURL });
    });
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
  getCustomerOrders,
};
