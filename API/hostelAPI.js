const express = require("express");
const Hostel = require("../models/hostel");
const Owner = require('../models/admindb')
const router = express.Router();

// 📌 Get all hostels (For users)
router.get("/", async (req, res) => {
    try {
        const hostels = await Hostel.find().populate("owner", "username email");
        res.status(200).json(hostels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Get single hostel details (For users)
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

// 📌 Get all hostels owned by a specific owner (For owners)
router.get("/owner/:ownerId", async (req, res) => {
    try {
        const hostels = await Hostel.find({ owner: req.params.ownerId }).populate("rooms").populate("reviews");

        if (!hostels.length) {
            return res.status(404).json({ message: "No hostels found for this owner" });
        }

        res.status(200).json(hostels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Update hostel details (For owners)
router.put("/:id", async (req, res) => {
    try {
        const updatedHostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedHostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        res.status(200).json(updatedHostel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Delete hostel (For owners)
router.delete("/:id", async (req, res) => {
    try {
        const deletedHostel = await Hostel.findByIdAndDelete(req.params.id);

        if (!deletedHostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        res.status(200).json({ message: "Hostel deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
