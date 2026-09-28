const express = require("express");
const pool = require("../config/db");
const { protect, authorize } = require("../middleware/authMiddleware");
const { successResponse, errorResponse } = require("../utils/response");
const router = express.Router();
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role FROM users ORDER BY id DESC`,
    );
    return successResponse(res, 200, "Users fetched successfully", result.rows);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Server error");
  }
});
module.exports = router;
