const { cloudinary } = require("../config");
const Product = require("../models/product.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const QueryBuilder = require("../utils/queryBuilder");
const uploadFileToCloudinary = require("../utils/uploadFileToCloudinary");

// =========== get all products ==========
const getAllProducts = catchAsync(async (req, res, next) => {
  const query = Product.find();
  const queryBuilder = new QueryBuilder(query, req.query);

  queryBuilder.filter().sort().paginate();

  const products = await queryBuilder.query.lean();

  const totalProducts = await Product.countDocuments(queryBuilder.getFilters());

  res.status(200).json({
    success: true,
    message: "Products successfully fetched",
    count: products.length,
    total: totalProducts,
    totalPages: Math.ceil(totalProducts / (req.query.limit || 10)),
    currentPage: req.query.page || 1,
    data: products,
  });
});

// =========== get single product ==========
const getSingleProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product successfully fetched",
    product,
  });
});

// =========== create product ==========
const createProduct = catchAsync(async (req, res, next) => {
  const { name, price, description, stock, category } = req.body;
  const file = req.file;

  if (!file) return next(new AppError("Please Upload product image", 400));

  const result = await uploadFileToCloudinary(req.file);

  const product = await Product.create({
    name,
    price,
    description,
    category,
    stock,
    imageUrl: result.url,
  });

  res
    .status(201)
    .json({ success: true, message: "New product created", data: product });
});

// =========== update product ==========
const updateProduct = catchAsync(async (req, res, next) => {
  const { name, price, description, category, stock } = req.body;
  const { id } = req.params;

  let product = await Product.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  let imageUrl = product.imageUrl;

  if (req.file) {
    const uploadResult = await uploadFileToCloudinary(req.file);

    if (product.imageUrl) {
      const publicId = "techspace_products/".concat(
        product.imageUrl.split("/").pop().split(".")[0]
      );

      await cloudinary.uploader.destroy(publicId);
    }

    imageUrl = uploadResult.url;
  }

  // Update product details
  product = await Product.findByIdAndUpdate(
    id,
    { name, price, description, category, stock, imageUrl },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// =========== delete product ==========

const deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  if (product.imageUrl) {
    const publicId = "techspace_products/".concat(
      product.imageUrl.split("/").pop().split(".")[0]
    );

    await cloudinary.uploader.destroy(publicId);
  }
  await Product.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Product Deleted successfully",
  });
});
module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
