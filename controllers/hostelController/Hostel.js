const Hostel = require('../../models/hosteldb');
const Owner = require("../../models/admindb");
require('../../models/hostelJoindb');

const getAllHostels = async (req, res) => {
    try {
        const hostels = await Hostel.find().populate("owner", "username email").populate("rooms").populate("reviews");
        res.status(200).json({message : "All hostels", payload : hostels});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getOneHostel = async (req, res) => {
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
}

const getAllUnderOwner = async (req, res) => {
    try {
        
        const owner = await Owner.findById(req.params.ownerId);
        if (!owner) {
            return res.status(404).json({ message: "owner not found" });
        }
        const hostels = await Hostel.find({ owner: req.params.ownerId })
            .populate("rooms")
            .populate("reviews")
            .populate("maintainanceRequests")
            .populate({
                path: "joinRequests",
                populate: {
                    path: "student", 
                    model: "User",
                    select: "name email phone" 
                }
            });


        if (!hostels.length) {
            return res.status(404).json({ message: "No hostels found for this owner" });
        }
        return res.status(200).json({message : "All hostels" , payload : {owner, hostels}});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createNewHostel = async (req, res) => {
    try {
        const {id} = req.params; 
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
            hostelimage: hostelImage,
            owner: id
        });

        await newHostel.save();
        owner.hostels.push(newHostel._id);
        await owner.save();
        const hostels = await Hostel.find({ owner: owner._id });
        res.status(200).json({ message: "Hostel created successfully", payload: {owner, hostels} });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}

const updateHostel = async (req, res) => {
    try {
        const {ownerId, hosteId} = req.params;
        const hostel = await Hostel.findById(hosteId);
        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }
        const owner = await Owner.findById(ownerId);
        if(!owner){
            return res.status(404).json({ message: "Owner not found" });
        }

        // Check if the request comes from an authenticated owner who owns this hostel.
        if (hostel.owner.toString() !== owner._id.toString()) {
            return res.status(403).json({ message: "Access denied. You do not own this hostel." });
        }

        const updatedHostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedHostel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteHostel = async (req, res) => {
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
}

module.exports = {getAllHostels, getOneHostel, getAllUnderOwner, createNewHostel, updateHostel, deleteHostel}