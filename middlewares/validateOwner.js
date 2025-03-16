const ownerValidationSchema = require("../validateSchema/admin/validateAdmin");

module.exports.validateOwner = (req, res, next) => {
    const { error } = ownerValidationSchema.validate(req.body);
    if(error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};