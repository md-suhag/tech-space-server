const express = require("express");
const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrderStatus,
  getCustomerOrders,
} = require("../controllers/order.controller");

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getSingleOrder);
router.get("/customer", getCustomerOrders);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
