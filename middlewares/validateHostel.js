const hostelValidationSchema = require("../validateSchema/hostel/validateHostel");

module.exports.validateHostel = (req, res, next) => {
    const { error } = hostelValidationSchema.validate(req.body);
    if(error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};