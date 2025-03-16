const userValidationSchema = require("../validateSchema/user/validateUser");


module.exports.validateUser = (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body);
    if(error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};