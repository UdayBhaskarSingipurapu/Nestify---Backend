const Joi = require("joi");

const maintenanceValidationSchema = Joi.object({

    issueTitle: Joi.string().trim().required().messages({
        "string.base": "Issue title must be a string",
        "any.required": "Issue title is required"
    }),

    issueDescription: Joi.string().required().messages({
        "string.base": "Issue description must be a string",
        "any.required": "Issue description is required"
    }),

    status: Joi.string()
        .valid("pending", "in-progress", "resolved")
        .default("pending")
        .messages({
            "string.base": "Status must be a string",
            "any.only": "Status must be one of: pending, in-progress, resolved"
        })
        .optional()
});

module.exports = maintenanceValidationSchema;
