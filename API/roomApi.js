const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const { addRooms } = require('../controllers/roomController/Room');

const router = express.Router({mergeParams : true});

// Route to add multiple rooms
router.post("/:hostelId/add", wrapAsync(addRooms));


module.exports = router;