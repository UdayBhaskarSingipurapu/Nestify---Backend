const express = require('express');
const Room = require('../models/roomdb');
const Hostel = require('../models/hosteldb');
const router = express.Router({mergeParams : true});

// Route to add multiple rooms
router.post("/:hostelId/add", async (req, res) => {
    try {
        console.log(req.body);
        const { hostelId } = req.params;
        const roomsData = req.body;
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        const roomsWithHostelId = roomsData.map(room => ({
            ...room,
            hostel: hostelId
        }));

        const insertedRooms = await Room.insertMany(roomsWithHostelId);
        const roomIds = insertedRooms.map(room => room._id);
        await Hostel.findByIdAndUpdate(hostelId, { $push: { rooms: { $each: roomIds } } });
        res.status(200).json({ message: "Rooms added successfully", payload: insertedRooms });

    } catch (error) {
        console.error("Error adding rooms:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;