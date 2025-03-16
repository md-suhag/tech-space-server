const Product = require("../models/product.model");
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
    count: products.length,
    total: totalProducts,
    totalPages: Math.ceil(totalProducts / (req.query.limit || 10)),
    currentPage: req.query.page || 1,
    data: products,
  });
});

module.exports = {
  getAllProducts,
};
