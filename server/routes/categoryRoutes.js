const express = require("express");
const pool = require("../config/db");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validation/categoryValidation");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const router = express.Router();


// =========================
// Get All Categories
// =========================

router.get("/", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM categories ORDER BY id ASC"
    );

    return successResponse(
      res,
      200,
      "Categories fetched successfully",
      result.rows
    );

  } catch (error) {

    console.error(error);

    return errorResponse(
      res,
      500,
      "Failed to fetch categories"
    );
  }
});


// =========================
// Create Category
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
      } = createCategorySchema.validate(req.body);

      if (error) {
        return errorResponse(
          res,
          400,
          error.details[0].message
        );
      }


      // =========================
      // Get Validated Data
      // =========================

      const {
        name,
        description,
      } = value;


      // =========================
      // Check Duplicate Category
      // =========================

      const existingCategory = await pool.query(
        `SELECT *
         FROM categories
         WHERE LOWER(name) = LOWER($1)`,
        [name]
      );

      if (existingCategory.rows.length > 0) {
        return errorResponse(
          res,
          409,
          "Category already exists"
        );
      }


      // =========================
      // Create Category
      // =========================

      const result = await pool.query(
        `INSERT INTO categories
         (name, description)
         VALUES ($1, $2)
         RETURNING *`,
        [name, description]
      );


      // =========================
      // Response
      // =========================

      return successResponse(
        res,
        201,
        "Category created successfully",
        result.rows[0]
      );

    } catch (error) {

      console.error(error);

      return errorResponse(
        res,
        500,
        "Failed to create category"
      );
    }
  }
);


// =========================
// Update Category
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
      // Validate Category ID
      // =========================

      if (
        isNaN(Number(id)) ||
        Number(id) <= 0
      ) {
        return errorResponse(
          res,
          400,
          "Invalid category ID"
        );
      }


      // =========================
      // Joi Validation
      // =========================

      const {
        error,
        value,
      } = updateCategorySchema.validate(req.body);

      if (error) {
        return errorResponse(
          res,
          400,
          error.details[0].message
        );
      }


      // =========================
      // Get Validated Data
      // =========================

      const {
        name,
        description,
      } = value;


      // =========================
      // Check Category Exists
      // =========================

      const existingCategory = await pool.query(
        `SELECT *
         FROM categories
         WHERE id = $1`,
        [id]
      );

      if (existingCategory.rows.length === 0) {
        return errorResponse(
          res,
          404,
          "Category not found"
        );
      }


      // =========================
      // Check Duplicate Name
      // =========================

      const duplicateCategory = await pool.query(
        `SELECT *
         FROM categories
         WHERE LOWER(name) = LOWER($1)
         AND id != $2`,
        [name, id]
      );

      if (duplicateCategory.rows.length > 0) {
        return errorResponse(
          res,
          409,
          "Category name already exists"
        );
      }


      // =========================
      // Update Category
      // =========================

      const result = await pool.query(
        `UPDATE categories
         SET name = $1,
             description = $2
         WHERE id = $3
         RETURNING *`,
        [name, description, id]
      );


      // =========================
      // Response
      // =========================

      return successResponse(
        res,
        200,
        "Category updated successfully",
        result.rows[0]
      );

    } catch (error) {

      console.error(error);

      return errorResponse(
        res,
        500,
        "Failed to update category"
      );
    }
  }
);


// =========================
// Delete Category
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
        "DELETE FROM categories WHERE id = $1 RETURNING *",
        [id]
      );

      if (result.rows.length === 0) {
        return errorResponse(
          res,
          404,
          "Category not found"
        );
      }

      return successResponse(
        res,
        200,
        "Category deleted successfully",
        result.rows[0]
      );

    } catch (error) {

      console.error(error);

      return errorResponse(
        res,
        500,
        "Failed to delete category"
      );
    }
  }
);


// =========================
// Export Router
// =========================

module.exports = router;