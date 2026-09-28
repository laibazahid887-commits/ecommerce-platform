const Joi = require("joi");


// =========================
// Create Order Validation
// =========================

const createOrderSchema = Joi.object({
  total_amount: Joi.number()
    .positive()
    .required(),

  status: Joi.string()
    .valid(
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    )
    .default("pending"),
});


// =========================
// Add Order Item Validation
// =========================

const addOrderItemSchema = Joi.object({
  product_id: Joi.number()
    .integer()
    .positive()
    .required(),

  quantity: Joi.number()
    .integer()
    .positive()
    .required(),
});


// =========================
// Update Order Status Validation
// =========================

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled"
    )
    .required(),
});


module.exports = {
  createOrderSchema,
  addOrderItemSchema,
  updateOrderStatusSchema,
};