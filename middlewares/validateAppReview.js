const applicationReviewValidationSchema = require("../validateSchema/appReview/validateAppReview");

module.exports.validateAppReview = (req, res, next) => {
    const { error } = applicationReviewValidationSchema.validate(req.body);
    if(error) {
        console.log(error)
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};