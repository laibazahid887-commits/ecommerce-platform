const Joi = require("joi");


// =========================
// Create Category Validation
// =========================

const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .allow("")
    .max(500),
});


// =========================
// Update Category Validation
// =========================

const updateCategorySchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .allow("")
    .max(500),
});


module.exports = {
  createCategorySchema,
  updateCategorySchema,
};