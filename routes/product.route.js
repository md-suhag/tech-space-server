const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

module.exports = router;
