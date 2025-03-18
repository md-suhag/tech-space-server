const express = require("express");
const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrderStatus,
  getCustomerOrders,
} = require("../controllers/order.controller");
const { auth } = require("../middlewares/auth");
const ROLES = require("../constants/roles");

const router = express.Router();

router.get("/", auth(ROLES.ADMIN), getAllOrders);
router.get("/:id", auth(ROLES.CUSTOMER), getSingleOrder);
router.get("/customer", auth(ROLES.CUSTOMER), getCustomerOrders);
router.post("/", auth(ROLES.CUSTOMER), createOrder);
router.put("/:id/status", auth(ROLES.ADMIN), updateOrderStatus);

module.exports = router;
