const express = require('express');
const Review = require('../models/reviewdb');
const Hostel = require('../models/hosteldb');
const router = express.Router({mergeParams : true});

router.post('/:id/new', async (req, res) => {
    try {
        const { id } = req.params;  
        const hostel = await Hostel.findById(id);
        if(!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }
        const review = new Review(req.body.review);
        review.author = req.user._id;  
        hostel.reviews.push(review);
        await review.save();
        await hostel.save();
        res.status(200).json({ message: "Review created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
