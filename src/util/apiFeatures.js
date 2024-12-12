const { Op } = require("sequelize");

class APIFeatures {
  constructor(model, queryString, options = {}) {
    this.model = model; // Sequelize model
    this.queryString = queryString; // Incoming query string
    this.queryOptions = { where: {}, raw: true, nest: true }; // Initialize query options with where clause
    this.options = options;
  }

  filter() {
    // Exclude special fields like page, sort, limit, and fields
    // eslint-disable-next-line
    const { page, sort, limit, fields, ...queryObj } = this.queryString;
    this.queryObject = queryObj;
    // Map query operators (gte, gt, lte, lt) to Sequelize operators
    Object.keys(queryObj).forEach((key) => {
      if (typeof queryObj[key] === "object") {
        const filter = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const operator in queryObj[key]) {
          if (["gte", "gt", "lte", "lt", "eq", "ne"].includes(operator)) {
            filter[Op[operator]] = queryObj[key][operator];
          }
        }
        this.queryOptions.where[key] = filter;
      } else {
        this.queryOptions.where[key] = queryObj[key];
      }
    });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").map((field) => {
        if (field.startsWith("-")) {
          return [field.substring(1), "DESC"];
        }
        return [field, "ASC"];
      });
      this.queryOptions.order = sortBy;
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(","); // Example: 'name,email'
      this.queryOptions.attributes = fields;
    }

    return this;
  }

  paginate() {
    if (this.queryString.page) {
      const page = this.queryString.page
        ? parseInt(this.queryString.page, 10)
        : 1;
      const limit = this.queryString.limit
        ? parseInt(this.queryString.limit, 10)
        : 10;
      const offset = (page - 1) * limit;

      this.queryOptions.limit = limit;
      this.queryOptions.offset = offset;
    }

    return this;
  }

  async execute() {
    const queryOptions = {
      where: this.queryObject,
    };

    // Dynamically apply attributes if passed
    if (this.options && this.options.attributes) {
      queryOptions.attributes = this.options.attributes;
    }
    return this.model.findAll(queryOptions);
  }
}

module.exports = APIFeatures;
