const express = require("express");
const {
  getProductReviews,
  createReview,
  deleteReview,
  getCustomerReviews,
} = require("../controllers/review.controller");
const { auth } = require("../middlewares/auth");
const ROLES = require("../constants/roles");

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", auth(ROLES.CUSTOMER), createReview);
router.delete("/:reviewId", auth(ROLES.CUSTOMER), deleteReview);
router.get("/customer", auth(ROLES.ADMIN, ROLES.CUSTOMER), getCustomerReviews);

module.exports = router;
