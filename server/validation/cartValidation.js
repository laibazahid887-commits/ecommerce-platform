const Joi = require("joi");

// Add item to cart
const addCartItemSchema = Joi.object({
  product_id: Joi.number()
    .integer()
    .positive()
    .required(),

  quantity: Joi.number()
    .integer()
    .positive()
    .required(),
});

// Update cart item quantity
const updateCartItemSchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .positive()
    .required(),
});

module.exports = {
  addCartItemSchema,
  updateCartItemSchema,
};