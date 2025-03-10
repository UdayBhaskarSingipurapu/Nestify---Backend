const express = require("express");
const multer  = require('multer')
const Hostel = require('../models/hosteldb')
const Owner = require("../models/admindb");
const router = express.Router();
const {storage} = require("../config/cloudConfig");
const upload = multer({ storage })

// -------------------------------------
// GET all hostels (For users)
// -------------------------------------
router.get("/", async (req, res) => {
    try {
        // You could log authentication info if needed:
        // console.log("Authenticated user:", req.user);
        // console.log("Authenticated owner:", req.owner);

        const hostels = await Hostel.find().populate("owner", "username email");
        res.status(200).json(hostels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -------------------------------------
// GET single hostel details (For users)
// -------------------------------------
router.get("/:id", async (req, res) => {
    try {
        const hostel = await Hostel.findById(req.params.id)
            .populate("owner", "username email")
            .populate("rooms")
            .populate("reviews");

        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        res.status(200).json(hostel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -------------------------------------
// GET all hostels owned by the authenticated owner
// -------------------------------------
router.get("/owner/:ownerId", async (req, res) => {
    try {
        // Ensure that an owner is authenticated.
        if (!req.owner) {
            return res.status(403).json({ message: "Access denied. Only owners can access their hostels." });
        }
        // Verify that the ownerId in the URL matches the authenticated owner.
        if (req.owner._id.toString() !== req.params.ownerId) {
            return res.status(403).json({ message: "Access denied. You can only view your own hostels." });
        }

        const hostels = await Hostel.find({ owner: req.params.ownerId })
            .populate("rooms")
            .populate("reviews")
            .populate("maintainanceRequests");

        if (!hostels.length) {
            return res.status(404).json({ message: "No hostels found for this owner" });
        }

        res.status(200).json(hostels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -------------------------------------
// POST: Create a new hostel (Only for authenticated owners)
// -------------------------------------
router.post("/createhostel/:id", upload.single("hostelImage"), async (req, res) => {
    try {
        const id = req.params.id; 
        let owner = await Owner.findById(id);
        if (!owner) {
            return res.status(404).json({ message: "User Not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image upload failed. Please provide an image." });
        }

        const { hostelname, doorNo, street, city, state } = req.body;

        const hostelImage = {
            url: req.file.path,
            filename: req.file.filename,
        };

        const addressLine = {
            doorNo,
            street,
            city,
            state
        };

        const newHostel = new Hostel({
            hostelname,
            addressLine,
            image: hostelImage,
            owner: id
        });

        await newHostel.save();
        owner.hostels.push(newHostel._id);
        await owner.save();

        res.status(200).json({ message: "Hostel created successfully", payload: {owner, newHostel} });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});



// -------------------------------------
// PUT: Update hostel details (Only for authenticated owners)
// -------------------------------------
router.put("/:id", async (req, res) => {
    try {
        const hostel = await Hostel.findById(req.params.id);
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        // Check if the request comes from an authenticated owner who owns this hostel.
        if (!req.owner || hostel.owner.toString() !== req.owner._id.toString()) {
            return res.status(403).json({ message: "Access denied. You do not own this hostel." });
        }

        const updatedHostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedHostel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -------------------------------------
// DELETE: Delete hostel (Only for authenticated owners)
// -------------------------------------
router.delete("/:id", async (req, res) => {
    try {
        const hostel = await Hostel.findById(req.params.id);
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        // Check that the authenticated owner is the owner of the hostel.
        if (!req.owner || hostel.owner.toString() !== req.owner._id.toString()) {
            return res.status(403).json({ message: "Access denied. You do not own this hostel." });
        }

        await Hostel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Hostel deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;