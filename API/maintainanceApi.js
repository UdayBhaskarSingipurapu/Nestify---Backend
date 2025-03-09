const express = require('express');
const Maintenance = require('../models/maintainacedb');
const Hostel = require('../models/hosteldb');
const router = express.Router({mergeParams : true});
// const {isUser, isOwner} = require('../middlewares/authentication/auth');
const User = require('../models/userdb');

router.get('/all/:hosteId', async(req, res) => {
    try {
        const {hostelId} = req.params;
        const hostel = await Hostel.findById(hostelId);

        if(!hostel){
            res.status(404).json({message : "Hostel not found"});
        }
        const maintainanceReq = hostel.maintainancerequests;
        res.status(200).json({message : "All maintainace Requests", payload : maintainanceReq});
    }
    catch(err){
        res.status(500).json({message : "Failed to fetch"});
    }
})

router.post('/:id/new', async (req, res) => {
    try{
        const {id} = req.params;
        let hostel = await Hostel.findById(id);
        if(!hostel){
            return res.status(404).json({message : "Hostel not found"});
        }
        const {issueTitle, issueDescription} = req.body;
        const user = id;
        const newMaintainanceReq = {
            student : user._id,
            hostel : hostel._id,
            issueTitle : issueTitle, 
            issueDescription : issueDescription
        }
        const registeredMaintainanceReq = new Maintenance(newMaintainanceReq);
        await registeredMaintainanceReq.save();
    
        user.maintainance.push(registeredMaintainanceReq);
        hostel.maintainance.push(registeredMaintainanceReq);
        await user.save();
        await hostel.save();
        return res.status(200).json({message : "Maintainance Request raised successfully", payload : registeredMaintainanceReq});
    }
    catch(err){
        res.status(500).json({ message: "Server error", payload: err.message });
    }
});

router.put('/edit', async (req, res) => {
    try {
        let { id } = req.params;
        const maintainanceReq = await Maintenance.findById(id);
        if(!maintainanceReq){
            return res.status(401).json({message : "Maintainance Request not found"});
        }
        const {status} = req.body;
        maintainanceReq.status = status;
        await maintainanceReq.save();
        return res.status(200).json({message : "Maintainance Request status updated successfully"});
    }
    catch(err) {
        return res.status(500).json({message : "Server Error", payload : err.message})
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const maintenanceReq = await Maintenance.findById(id);
        if(!maintenanceReq) {
            return res.status(404).json({ message: "Maintenance request not found" });
        }
        await User.updateOne(
            { _id: maintenanceReq.student }, 
            { $pull: { maintenance: id } }
        );
        await Hostel.updateOne(
            { maintenance: id }, 
            { $pull: { maintenance: id } }
        );
        await Maintenance.findByIdAndDelete(id);
        res.status(200).json({ message: "Maintenance request deleted successfully" });
    } 
    catch (error) {
        res.status(500).json({ message: "Server error", payload: error.message });
    }
});


module.exports = router;
