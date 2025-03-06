const Joi = require('joi');

const ownerValidationSchema = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "Username is required"
    }),

    googleId: Joi.string().optional(),

    email: Joi.string().email().required().messages({
        "string.email": "Enter a valid email address",
        "string.empty": "Email is required"
    }),

    password: Joi.string().optional(),

    profileImage: Joi.object({
        url: Joi.string().uri().optional().messages({
            "string.uri": "Profile image URL must be a valid URI"
        }),
        filename: Joi.string().optional()
    }).optional(),

    contact: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            "string.empty": "Contact number is required",
            "string.pattern.base": "Enter a valid 10-digit contact number"
    }),
});

module.exports = (req, res, next) => {
    const { error } = ownerValidationSchema.validate(req.body);
    if(error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
