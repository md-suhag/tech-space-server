const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { productImage } = require("../middlewares/multer");
const { auth } = require("../middlewares/auth");
const ROLES = require("../constants/roles");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/", productImage, auth(ROLES.ADMIN), createProduct);
router.put("/:id", productImage, auth(ROLES.ADMIN), updateProduct);
router.delete("/:id", auth(ROLES.ADMIN), deleteProduct);

module.exports = router;
