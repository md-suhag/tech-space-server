const Product = require("../models/product.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const QueryBuilder = require("../utils/queryBuilder");
const uploadFileToCloudinary = require("../utils/uploadFileToCloudinary");

const getAllProducts = catchAsync(async (req, res, next) => {
  const query = Product.find();
  const queryBuilder = new QueryBuilder(query, req.query);

  const products = await queryBuilder.filter().sort().paginate().query.lean();

  const totalProducts = await Product.countDocuments(
    queryBuilder.filter().query.getFilter()
  );

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
module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
};
