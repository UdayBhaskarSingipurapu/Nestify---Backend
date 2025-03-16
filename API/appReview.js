const express = require('express');
const router = express.Router({mergeParams : true});
const {getAll, createNew} = require('../controllers/appReviewController/AppReview');
const { validateAppReview } = require('../middlewares/validateAppReview');
const wrapAsync = require('../utils/wrapAsync');

router.get('/all', getAll)

router.post('/:id/new', validateAppReview, wrapAsync(createNew));

module.exports = router;
