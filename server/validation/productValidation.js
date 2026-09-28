const Joi = require("joi");


// =========================
// Create Product Validation
// =========================

const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required(),

  description: Joi.string()
    .allow("")
    .max(1000),

  price: Joi.number()
    .positive()
    .required(),

  stock: Joi.number()
    .integer()
    .min(0)
    .default(0),

  image: Joi.string()
    .allow("")
    .max(255),

  category_id: Joi.number()
    .integer()
    .positive()
    .allow(null, ""),
});


// =========================
// Update Product Validation
// =========================

const updateProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required(),

  description: Joi.string()
    .allow("")
    .max(1000),

  price: Joi.number()
    .positive()
    .required(),

  stock: Joi.number()
    .integer()
    .min(0)
    .required(),

  image: Joi.string()
    .allow("")
    .max(255),

  category_id: Joi.number()
    .integer()
    .positive()
    .allow(null, ""),
});


module.exports = {
  createProductSchema,
  updateProductSchema,
};