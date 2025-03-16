const Maintenance = require('../../models/maintainacedb');
const Hostel = require('../../models/hosteldb');
const User = require('../../models/userdb');

const getAll = async(req, res) => {
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
}

const createNewRequest = async (req, res) => {
    try{
        const {id, hostelId} = req.params;
        let hostel = await Hostel.findById(hostelId);
        if(!hostel){
            return res.status(404).json({message : "Hostel not found"});
        }
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        const {issueTitle, issueDescription} = req.body;
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
}

const editMaintainceReq = async (req, res) => {
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
}

const deleteMaintainceReq =  async (req, res) => {
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
}

module.exports = {getAll, createNewRequest, editMaintainceReq, deleteMaintainceReq}