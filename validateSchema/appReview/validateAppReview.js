const Joi = require("joi");

const applicationReviewValidationSchema = Joi.object({
    comment: Joi.string().trim().allow("").messages({
        "string.base": "Comment must be a string"
    }),

    rating: Joi.number().integer().min(1).max(5).required().messages({
        "number.base": "Rating must be a number",
        "number.min": "Rating must be at least 1",
        "number.max": "Rating must not exceed 5",
        "any.required": "Rating is required"
    }),
});

module.exports = applicationReviewValidationSchema;
