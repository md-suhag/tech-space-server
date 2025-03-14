const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
  totalPrice: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ["pending", "shipped", "completed", "canceled"],
    default: "pending",
  },
  shippingAddress: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed"],
    default: "pending",
  },
  paymentMethod: { type: String, enum: ["SSLCommerz"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
