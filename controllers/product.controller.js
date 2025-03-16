const Product = require("../models/product.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const QueryBuilder = require("../utils/queryBuilder");

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

module.exports = {
  getAllProducts,
  getSingleProduct,
};
