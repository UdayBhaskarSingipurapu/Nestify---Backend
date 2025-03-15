const express = require('express');
const hostelJoinRequest = require('../models/hostelJoindb');
const User = require('../models/userdb');
const Hostel = require('../models/hosteldb');
const router = express.Router({mergeParams : true});

router.get('/:studentId/:hostelId', async (req, res) => {
    try{
        const {studentId, hostelId} = req.params;
        const student = await User.findById(studentId);
        const hostel = await Hostel.findById(hostelId);
        if(!student || !hostel){
            return res.status(400).json({message : "Invalid details"});
        }
        const joinReq = new hostelJoinRequest({
            student : studentId,
            hostel : hostelId
        });
        const savedReq = await joinReq.save();
        student.hostelRequests.push(savedReq._id);
        await student.save();

        hostel.joinRequests.push(savedReq._id);
        await hostel.save();

        res.status(201).json({ message: "Join request sent successfully", request: savedReq });
    }    
    catch(err){

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

