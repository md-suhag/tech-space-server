const express = require("express");
const {
  handlePaymentSuccess,
  handlePaymentFail,
  handlePaymentCancel,
} = require("../controllers/payment.controller");

const router = express.Router();

router.post("/success/:orderId", handlePaymentSuccess);
router.post("/fail/:orderId", handlePaymentFail);
router.post("/cancel/:orderId", handlePaymentCancel);

module.exports = router;
