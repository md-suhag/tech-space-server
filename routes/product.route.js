const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
} = require("../controllers/product.controller");
const { productImage } = require("../middlewares/multer");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/", productImage, createProduct);
router.put("/:id", productImage, updateProduct);

module.exports = router;
