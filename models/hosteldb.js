const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
    }, 
    location: { 
        type: String, 
        required: true 
    }, 
    totalRooms: { 
        type: Number, 
        required: true 
    }, 
    availableRooms: { 
        type: Number, 
        default: 0 
    }, 
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
});

const Hostel = mongoose.model("Hostel", HostelSchema);

module.exports = Hostel;