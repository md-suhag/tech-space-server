const express = require("express");
const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrderStatus,
} = require("../controllers/order.controller");

const router = express.Router();

router.get("/", getAllOrders);
router.get("/:id", getSingleOrder);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
