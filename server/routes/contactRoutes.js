const express = require("express");
const pool = require("../config/db");
const { protect, authorize } = require("../middleware/authMiddleware");
const { successResponse, errorResponse } = require("../utils/response");
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return errorResponse(res, 400, "Name, email, and message are required");
    }
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING id, name, email, message, created_at`,
      [name.trim(), email.trim(), message.trim()],
    );
    return successResponse(
      res,
      201,
      "Message sent successfully",
      result.rows[0],
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Unable to send message");
  }
});
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC`,
    );
    return successResponse(
      res,
      200,
      "Contact messages fetched successfully",
      result.rows,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Unable to fetch contact messages");
  }
});
module.exports = router;
