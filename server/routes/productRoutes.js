const express = require("express");
const pool = require("../config/db");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validation/productValidation");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const router = express.Router();


// =========================
// Get All Products
// =========================

// =========================
// Get Products
// Pagination + Search
// Category + Price Filter
// Sorting
// =========================

router.get("/", async (req, res) => {
  try {

    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      sort = "newest",
    } = req.query;


    // =========================
    // Pagination
    // =========================

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1
    ) {
      return res.status(400).json({
        message: "Page must be a positive integer",
      });
    }

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        message: "Limit must be between 1 and 100",
      });
    }

    const offset =
      (pageNumber - 1) * limitNumber;


    // =========================
    // Build Query
    // =========================

    let query = `
      SELECT *
      FROM products
      WHERE 1 = 1
    `;

    const values = [];
    let parameterIndex = 1;


    // =========================
    // Search
    // =========================

    if (search) {

      query += `
        AND name ILIKE $${parameterIndex}
      `;

      values.push(`%${search}%`);

      parameterIndex++;
    }


    // =========================
    // Category Filter
    // =========================

    if (category) {

      if (
        !Number.isInteger(Number(category)) ||
        Number(category) <= 0
      ) {
        return res.status(400).json({
          message: "Invalid category",
        });
      }

      query += `
        AND category_id = $${parameterIndex}
      `;

      values.push(Number(category));

      parameterIndex++;
    }


    // =========================
    // Minimum Price
    // =========================

    if (minPrice !== undefined) {

      if (
        isNaN(Number(minPrice)) ||
        Number(minPrice) < 0
      ) {
        return res.status(400).json({
          message: "Invalid minimum price",
        });
      }

      query += `
        AND price >= $${parameterIndex}
      `;

      values.push(Number(minPrice));

      parameterIndex++;
    }


    // =========================
    // Maximum Price
    // =========================

    if (maxPrice !== undefined) {

      if (
        isNaN(Number(maxPrice)) ||
        Number(maxPrice) < 0
      ) {
        return res.status(400).json({
          message: "Invalid maximum price",
        });
      }

      query += `
        AND price <= $${parameterIndex}
      `;

      values.push(Number(maxPrice));

      parameterIndex++;
    }


    // =========================
    // Sorting
    // =========================

    const sortOptions = {
      newest: "created_at DESC",
      oldest: "created_at ASC",
      price_asc: "price ASC",
      price_desc: "price DESC",
      name_asc: "name ASC",
      name_desc: "name DESC",
    };

    if (!sortOptions[sort]) {
      return res.status(400).json({
        message: "Invalid sort option",
      });
    }

    query += `
      ORDER BY ${sortOptions[sort]}
    `;


    // =========================
    // Pagination
    // =========================

    query += `
      LIMIT $${parameterIndex}
      OFFSET $${parameterIndex + 1}
    `;

    values.push(limitNumber);
    values.push(offset);


    // =========================
    // Get Products
    // =========================

    const result = await pool.query(
      query,
      values
    );


    // =========================
    // Get Total Count
    // =========================

    let countQuery = `
      SELECT COUNT(*)
      FROM products
      WHERE 1 = 1
    `;

    const countValues = [];
    let countIndex = 1;


    if (search) {

      countQuery += `
        AND name ILIKE $${countIndex}
      `;

      countValues.push(`%${search}%`);

      countIndex++;
    }


    if (category) {

      countQuery += `
        AND category_id = $${countIndex}
      `;

      countValues.push(Number(category));

      countIndex++;
    }


    if (minPrice !== undefined) {

      countQuery += `
        AND price >= $${countIndex}
      `;

      countValues.push(Number(minPrice));

      countIndex++;
    }


    if (maxPrice !== undefined) {

      countQuery += `
        AND price <= $${countIndex}
      `;

      countValues.push(Number(maxPrice));

      countIndex++;
    }


    const countResult = await pool.query(
      countQuery,
      countValues
    );

    const totalProducts =
      Number(countResult.rows[0].count);

    const totalPages =
      Math.ceil(totalProducts / limitNumber);


    // =========================
    // Response
    // =========================

  return successResponse(
  res,
  200,
  "Products fetched successfully",
  {
    products: result.rows,

    pagination: {
      current_page: pageNumber,
      per_page: limitNumber,
      total_products: totalProducts,
      total_pages: totalPages,
    },
  }
);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});


// =========================
// Get Single Product
// =========================

router.get("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    // =========================
    // Validate Product ID
    // =========================

    if (
      isNaN(Number(id)) ||
      Number(id) <= 0
    ) {
      return errorResponse(
        res,
        400,
        "Invalid product ID"
      );
    }

    // =========================
    // Get Product
    // =========================

    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    // Product not found
    if (result.rows.length === 0) {
      return errorResponse(
        res,
        404,
        "Product not found"
      );
    }

    // =========================
    // Response
    // =========================

    return successResponse(
      res,
      200,
      "Product fetched successfully",
      result.rows[0]
    );

  } catch (error) {

    console.error(error);

    return errorResponse(
      res,
      500,
      "Failed to fetch product"
    );
  }
});


// =========================
// Create Product
// Admin Only
// =========================

router.post(
  "/",
  protect,
  authorize("admin"),
  async (req, res) => {

    try {

      // =========================
      // Joi Validation
      // =========================

      const {
        error,
        value,
      } = createProductSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }


      // =========================
      // Get Validated Data
      // =========================

      const {
        name,
        description,
        price,
        stock,
        image,
        category_id,
      } = value;

// Check if category exists
if (category_id) {
  const categoryResult = await pool.query(
    `SELECT id
     FROM categories
     WHERE id = $1`,
    [category_id]
  );

  if (categoryResult.rows.length === 0) {
  return errorResponse(
  res,
  404,
  "Category not found"
);
  }
}
      // =========================
      // Create Product
      // =========================

      const result = await pool.query(
        `INSERT INTO products
         (name, description, price, stock, image, category_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          name,
          description,
          price,
          stock,
          image,
          category_id || null,
        ]
      );


      // =========================
      // Response
      // =========================

      return successResponse(
  res,
  201,
  "Product created successfully",
  result.rows[0]
);

    } catch (error) {

      console.error(error);

      return errorResponse(
  res,
  500,
  "Failed to create product"
);
    }
  }
);


// =========================
// Update Product
// Admin Only
// =========================

router.put(
  "/:id",
  protect,
  authorize("admin"),
  async (req, res) => {

    try {

      const { id } = req.params;


      // =========================
      // Validate Product ID
      // =========================

      if (
        isNaN(Number(id)) ||
        Number(id) <= 0
      ) {
       return errorResponse(
  res,
  400,
  "Invalid product ID"
);
      }


      // =========================
      // Joi Validation
      // =========================

      const {
        error,
        value,
      } = updateProductSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }


      // =========================
      // Get Validated Data
      // =========================

      const {
        name,
        description,
        price,
        stock,
        image,
        category_id,
      } = value;

// Check if category exists
if (category_id) {
  const categoryResult = await pool.query(
    `SELECT id
     FROM categories
     WHERE id = $1`,
    [category_id]
  );

  if (categoryResult.rows.length === 0) {
  return errorResponse(
  res,
  404,
  "Category not found"
);
  }
}
      // =========================
      // Check Product Exists
      // =========================

      const existingProduct = await pool.query(
        `SELECT *
         FROM products
         WHERE id = $1`,
        [id]
      );

      if (existingProduct.rows.length === 0) {
        return errorResponse(
  res,
  404,
  "Product not found"
);
      }


      // =========================
      // Update Product
      // =========================

      const result = await pool.query(
        `UPDATE products
         SET name = $1,
             description = $2,
             price = $3,
             stock = $4,
             image = $5,
             category_id = $6
         WHERE id = $7
         RETURNING *`,
        [
          name,
          description,
          price,
          stock,
          image,
          category_id || null,
          id,
        ]
      );


      // =========================
      // Response
      // =========================

   return successResponse(
  res,
  200,
  "Product updated successfully",
  result.rows[0]
);

    } catch (error) {

      console.error(error);

return errorResponse(
  res,
  500,
  "Failed to update product"
);
    }
  }
);


// =========================
// Delete Product
// Admin Only
// =========================

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req, res) => {

    try {

      const { id } = req.params;

      const result = await pool.query(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        return errorResponse(
          res,
          404,
          "Product not found"
        );
      }

      return successResponse(
        res,
        200,
        "Product deleted successfully",
        result.rows[0]
      );

    } catch (error) {

      console.error(error);

      return errorResponse(
        res,
        500,
        "Failed to delete product"
      );
    }
  }
);


module.exports = router;