class QueryBuilder {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
    this._filters = {};
  }

  filter() {
    let filters = {};

    if (this.queryParams.category) {
      filters.category = {
        $regex: String(this.queryParams.category),
        $options: "i",
      };
    }

    if (this.queryParams.minPrice || this.queryParams.maxPrice) {
      filters.price = {};
      if (this.queryParams.minPrice)
        filters.price.$gte = Number(this.queryParams.minPrice);
      if (this.queryParams.maxPrice)
        filters.price.$lte = Number(this.queryParams.maxPrice);
    }

    if (this.queryParams.search) {
      filters.name = { $regex: String(this.queryParams.search), $options: "i" };
    }

    this._filters = filters;
    this.query = this.query.where(filters);
    return this;
  }

  getFilters() {
    return this._filters;
  }

  sort() {
    const sortFields = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };

    this.query = this.query.sort(
      sortFields[this.queryParams.sort] || { createdAt: -1 }
    );
    return this;
  }

  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = QueryBuilder;
