const express = require('express');
const hostelJoinRequest = require('../models/hostelJoindb');
const User = require('../models/userdb');
const Hostel = require('../models/hosteldb');
const Room = require('../models/roomdb');
const router = express.Router({mergeParams : true});

router.post('/:studentId/:hostelId/:roomId', async (req, res) => {
    try{
        const {studentId, hostelId, roomId} = req.params;
        const student = await User.findById(studentId);
        const hostel = await Hostel.findById(hostelId);
        const room = await Room.findById(roomId)
        if(!student || !hostel || !room){
            return res.status(400).json({message : "Invalid details"});
        }
        const joinReq = new hostelJoinRequest({
            student : studentId,
            hostel : hostelId,
            room: roomId
        });
        const savedReq = await joinReq.save();
        student.hostelRequests.push(savedReq._id);
        await student.save();

        hostel.joinRequests.push(savedReq._id);
        await hostel.save();

        return res.status(201).json({ message: "Join request sent successfully", payload: savedReq });
    }    
    catch(err){
        console.log(err)
        return res.status(500).json({message : "join request failed", payload : err})
    }
});

// Approve a join request
router.post('/approve/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;

        // Find the join request
        const request = await hostelJoinRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Join request not found" });
        }

        const studentId = request.student;
        const hostelId = request.hostel;

        // Approve the request
        request.status = "approved";
        await request.save();

        // Delete only pending join requests, excluding the approved one
        await hostelJoinRequest.deleteMany({
            student: studentId,
            status: "pending",
            _id: { $ne: requestId } // Keep the approved request
        });

        // Remove join requests from all other hostels except the approved one
        await Hostel.updateMany(
            { _id: { $ne: hostelId }, "joinRequests": studentId }, // Other hostels where the student has pending requests
            { $pull: { joinRequests: studentId } } // Remove student from joinRequests array
        );

        // Remove only pending requests from the User schema, keeping the approved request
        await User.findByIdAndUpdate(studentId, {
            $pull: { joinRequests: { $ne: requestId } } // Remove only pending requests
        });

        res.status(200).json({ message: "Join request approved, other requests deleted" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/reject/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;

        // Find the join request
        const request = await hostelJoinRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Join request not found" });
        }

        // Update request status to "rejected"
        request.status = "rejected";
        await request.save();

        // Delete this request from the Hostel collection
        await Hostel.findByIdAndUpdate(request.hostel, {
            $pull: { hostelRequests: request._id } 
        });

        res.status(200).json({ message: "Join request rejected and removed from hostel" });

    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

module.exports = router;