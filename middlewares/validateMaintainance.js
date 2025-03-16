const maintenanceValidationSchema = require("../validateSchema/maintainace/validateMaintainceReq");

module.exports.validateMaintanceReq = (req, res, next) => {
    const { error } = maintenanceValidationSchema.validate(req.body);
    if(error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};