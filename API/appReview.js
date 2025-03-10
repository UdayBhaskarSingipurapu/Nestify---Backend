const express = require('express');
const ApplicationReview = require('../models/applicationReviewdb');
const router = express.Router({mergeParams : true});

router.post('/new', async (req, res) => {
    try {
        console.log(req.user)
        const {review, rating} = req.body;
        const newreview = new ApplicationReview({
            comment : review,
            rating : rating
        });
        newreview.author = req.user._id;  
        await newreview.save();
        res.status(201).json({ message: "Review created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
