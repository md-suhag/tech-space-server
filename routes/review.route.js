const express = require("express");
const {
  getProductReviews,
  createReview,
  deleteReview,
} = require("../controllers/review.controller");

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", createReview);
router.delete("/:reviewId", deleteReview);

module.exports = router;
