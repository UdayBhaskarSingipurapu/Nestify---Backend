const express = require("express");
const multer  = require('multer')
const Hostel = require('../models/hosteldb')
const Owner = require("../models/admindb");
const router = express.Router();
const {storage} = require("../config/cloudConfig");
const upload = multer({ storage })
require('../models/hostelJoindb')
const {getAllHostels, getOneHostel, getAllUnderOwner, createNewHostel, updateHostel, deleteHostel} = require('../controllers/hostelController/Hostel');
const wrapAsync = require("../utils/wrapAsync");
const { validateHostel } = require("../middlewares/validateHostel");

// -------------------------------------
// GET all hostels (For users)
// -------------------------------------
router.get("/", wrapAsync(getAllHostels));

// -------------------------------------
// GET single hostel details (For users)
// -------------------------------------
router.get("/:id", wrapAsync(getOneHostel));

// -------------------------------------
// GET all hostels owned by the authenticated owner
// -------------------------------------
router.get("/owner/:ownerId", wrapAsync(getAllUnderOwner));

// -------------------------------------
// POST: Create a new hostel (Only for authenticated owners)
// -------------------------------------
router.post("/createhostel/:id", upload.single("hostelImage"), validateHostel, wrapAsync(createNewHostel));


// -------------------------------------
// PUT: Update hostel details (Only for authenticated owners)
// -------------------------------------
router.put("/:ownerId/:hostelId", wrapAsync(updateHostel));

// -------------------------------------
// DELETE: Delete hostel (Only for authenticated owners)
// -------------------------------------
router.delete("/:id", wrapAsync(deleteHostel));

module.exports = router;