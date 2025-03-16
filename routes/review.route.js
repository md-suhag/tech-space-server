const express = require("express");
const {
  getProductReviews,
  createReview,
} = require("../controllers/review.controller");

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", createReview);

module.exports = router;
