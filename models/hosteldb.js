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
    rooms : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Room"
        }
    ],
    totalRooms: { 
        type: Number, 
        required: true 
    }, 
    availableRooms: { 
        type: Number, 
        default: 0 
    }, 
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Owner", 
        required: true 
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
});

const Hostel = mongoose.model("Hostel", HostelSchema);

module.exports = Hostel;