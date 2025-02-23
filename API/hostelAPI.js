const express = require("express");
const multer  = require('multer')
const Hostel = require('../models/hosteldb')
const Owner = require("../models/admindb");
const router = express.Router();
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

// -------------------------------------
// GET all hostels (For users)
// -------------------------------------
// This endpoint is public. Optionally, if the request includes
// req.user (authenticated user) or req.owner (authenticated owner),
// you could use that info to tailor the response.
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
// This endpoint is public. Both authenticated users (req.user)
// and owners (req.owner) can access hostel details.
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
// This route uses req.owner. Only an authenticated owner may access this route,
// and they can only fetch hostels that belong to them.
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
            .populate("reviews");

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
// Notice we no longer accept an "owner" field in the body; instead we use req.owner.
router.post("/createhostel", upload.single("image"), async (req, res) => {
    try {
        // Ensure that an owner is authenticated.
        if (!req.owner) {
            return res.status(403).json({ message: "Access denied. Only owners can add hostels." });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Image upload failed. Please provide an image." });
        }
        // Extract hostel details from the request body.
        const { name, addressLine, rooms, totalRooms, availableRooms, fees } = req.body;
        
        const image = {
            url: req.file.path,  
            filename: req.file.filename,
        }

        // Create a new hostel with the authenticated owner's _id.
        const newHostel = new Hostel({
            name,
            addressLine,
            image,
            rooms,
            totalRooms,
            availableRooms,
            fees,
            owner: req.owner._id  // Automatically set the owner from the authentication middleware
        });

        await newHostel.save();

        res.status(201).json({ message: "Hostel created successfully", hostel: newHostel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -------------------------------------
// PUT: Update hostel details (Only for authenticated owners)
// -------------------------------------
// Only the owner who created the hostel can update it.
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
// Only the owner who created the hostel can delete it.
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
