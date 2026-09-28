require("dotenv").config();

const jwt = require("jsonwebtoken");

const {
  errorResponse,
} = require("../utils/response");

// =========================
// Protect Route
// =========================

const protect = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    // Authorization header missing
    if (!authHeader) {
      return errorResponse(
        res,
        401,
        "Authentication required"
      );
    }

    // Extract token
    const token =
      authHeader.split(" ")[1];

    // Token missing
    if (!token) {
      return errorResponse(
        res,
        401,
        "Token missing"
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store decoded user information
    req.user = decoded;

    next();

  } catch (error) {

    return errorResponse(
      res,
      401,
      "Invalid or expired token"
    );
  }
};

// =========================
// Authorize Roles
// =========================

const authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        "Access denied"
      );
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};