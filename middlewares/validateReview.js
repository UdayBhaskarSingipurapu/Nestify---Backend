const hostelReviewValidationSchema = require("../validateSchema/hostelReview/validateHostelReview");

module.exports.validateReview = (req, res, next) => {
    const { error } = hostelReviewValidationSchema.validate(req.body);
    if(error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};