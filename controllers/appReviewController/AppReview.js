const ApplicationReview = require('../../models/applicationReviewdb');

const getAll = async(req, res) => {
    const allReviews = await ApplicationReview.find().populate("author");
    if(allReviews.length === 0){
        return res.json({message : "No reviews found"});
    }
    return res.json({message : "All reviews", payload : allReviews});
}

const createNew = async (req, res) => {
    try {
        const {id} = req.params;
        const {comment, rating} = req.body;
        const newreview = new ApplicationReview({
            comment : comment,
            rating : rating
        });
        newreview.author = id;  
        await newreview.save();
        res.status(201).json({ message: "Review created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {getAll, createNew};