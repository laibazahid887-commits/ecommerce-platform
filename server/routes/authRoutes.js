require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { registerSchema, loginSchema } = require("../validation/authValidation");
const { successResponse, errorResponse } = require("../utils/response");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }
    const { name, email, password } = value;
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (existingUser.rows.length > 0) {
      return errorResponse(res, 409, "Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role`,
      [name, email, hashedPassword],
    );
    return successResponse(
      res,
      201,
      "User registered successfully",
      result.rows[0],
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Server error");
  }
});
router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }
    const { email, password } = value;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return errorResponse(res, 401, "Invalid email or password");
    }
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return errorResponse(res, 401, "Invalid email or password");
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return successResponse(res, 200, "Login successful", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Server error");
  }
});
router.get("/me", protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role FROM users WHERE id = $1`,
      [req.user.id],
    );
    if (result.rows.length === 0) {
      return errorResponse(res, 404, "User not found");
    }
    return successResponse(
      res,
      200,
      "Profile retrieved successfully",
      result.rows[0],
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Server error");
  }
});
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return errorResponse(res, 400, "Name and email are required");
    }
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1 AND id != $2`,
      [email, req.user.id],
    );
    if (existingUser.rows.length > 0) {
      return errorResponse(res, 409, "Email already exists");
    }
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role`,
      [name, email, req.user.id],
    );
    if (result.rows.length === 0) {
      return errorResponse(res, 404, "User not found");
    }
    return successResponse(
      res,
      200,
      "Profile updated successfully",
      result.rows[0],
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Server error");
  }
});
router.put("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return errorResponse(
        res,
        400,
        "Current password and new password are required",
      );
    }
    if (newPassword.length < 6) {
      return errorResponse(
        res,
        400,
        "New password must be at least 6 characters",
      );
    }
    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [req.user.id],
    );
    if (result.rows.length === 0) {
      return errorResponse(res, 404, "User not found");
    }
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      result.rows[0].password,
    );
    if (!passwordMatch) {
      return errorResponse(res, 401, "Current password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [
      hashedPassword,
      req.user.id,
    ]);
    return successResponse(res, 200, "Password changed successfully", null);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Server error");
  }
});
module.exports = router;
