const mongoose = require('mongoose');

const applicationReviewSchema = new mongoose.Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5,
        required : true
    },
    createdat : {
        type : Date,
        default : Date.now
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});

const ApplicationReview = mongoose.model("ApplicationReview", applicationReviewSchema);

module.exports = ApplicationReview;