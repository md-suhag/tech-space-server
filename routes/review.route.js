const express = require("express");
const {
  getProductReviews,
  createReview,
  deleteReview,
  getCustomerReviews,
} = require("../controllers/review.controller");

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", createReview);
router.delete("/:reviewId", deleteReview);
router.get("/customer", getCustomerReviews);

module.exports = router;
