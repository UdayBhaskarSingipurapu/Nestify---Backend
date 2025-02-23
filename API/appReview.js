const express = require('express');
const ApplicationReview = require('../models/applicationReviewdb');
const router = express.Router({mergeParams : true});

router.post('/new', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
        const review = new ApplicationReview(req.body.review);
        review.author = req.user._id;  
        await review.save();
        res.status(201).json({ message: "Review created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
