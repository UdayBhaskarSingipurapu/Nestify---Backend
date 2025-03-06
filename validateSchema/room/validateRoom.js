const Joi = require("joi");

const roomValidationSchema = Joi.object({
    
    roomNumber: Joi.string().trim().required().messages({
        "string.base": "Room number must be a string",
        "any.required": "Room number is required"
    }),

    roomCapacity: Joi.number().integer().min(1).required().messages({
        "number.base": "Room capacity must be a number",
        "number.min": "Room capacity must be at least 1",
        "any.required": "Room capacity is required"
    }),

    airConditioned: Joi.boolean().default(false).messages({
        "boolean.base": "AirConditioned must be a boolean"
    }),

    fees: Joi.number().min(0).required().messages({
        "number.base": "Fees must be a number",
        "number.min": "Fees cannot be negative",
        "any.required": "Fees are required"
    }),

    occupied: Joi.number().integer().min(0).required().messages({
        "number.base": "Occupied must be a number",
        "number.min": "Occupied cannot be negative",
        "any.required": "Occupied field is required"
    }),

});

module.exports = roomValidationSchema;
