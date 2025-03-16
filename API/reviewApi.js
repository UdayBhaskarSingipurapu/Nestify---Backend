const express = require('express');
const router = express.Router({mergeParams : true});
const {createNew} = require('../controllers/hostelReviewController/HostelReview');
const { validateReview } = require('../middlewares/validateReview');
const wrapAsync = require('../utils/wrapAsync');

router.post('/:id/new', validateReview, wrapAsync(createNew));

module.exports = router;
