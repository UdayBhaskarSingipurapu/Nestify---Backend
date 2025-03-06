const Joi = require("joi");

const hostelValidationSchema = Joi.object({
    hostelname: Joi.string().trim().required().messages({
        "string.empty": "Hostel name is required"
    }),

    addressLine: Joi.object({
        doorNo: Joi.string().trim().required().messages({
            "string.empty": "Door number is required"
        }),
        street: Joi.string().trim().required().messages({
            "string.empty": "Street name is required"
        }),
        city: Joi.string().trim().required().messages({
            "string.empty": "City name is required"
        }),
        state: Joi.string().trim().required().messages({
            "string.empty": "State name is required"
        })
    }).required(),

    hostelimage: Joi.object({
        url: Joi.string().uri().optional().messages({
            "string.uri": "Hostel image URL must be a valid URI"
        }),
        filename: Joi.string().optional()
    }).required(),

});

module.exports = hostelValidationSchema;
