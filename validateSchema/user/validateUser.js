const Joi = require("joi");

const userValidationSchema = Joi.object({
    username: Joi.string().trim().required().messages({
        "string.empty": "Username is required"
    }),

    googleId: Joi.string().optional(),

    email: Joi.string().email().trim().lowercase().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required"
    }),
    
    password: Joi.string().optional(),

    profileImage: Joi.object({
        url: Joi.string().uri().required().messages({
            "string.uri": "Profile image URL must be a valid URI",
            "any.required": "Profile image URL is required"
        }),
        filename: Joi.string().optional()
    }).optional(),

    contact: Joi.string().length(10).pattern(/^\d{10}$/).required().messages({
        "string.pattern.base": "Enter a valid 10-digit contact number",
        "any.required": "Contact number is required"
    }),
    
    parentName: Joi.string().trim().required().messages({
        "string.empty": "Parent's name is required"
    }),

    parentContact: Joi.string().length(10).pattern(/^\d{10}$/).required().messages({
        "string.pattern.base": "Enter a valid 10-digit parent contact number",
        "any.required": "Parent contact number is required"
    }),
});

module.exports = (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body);
    if(error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
