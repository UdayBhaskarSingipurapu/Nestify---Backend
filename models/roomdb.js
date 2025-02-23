const mongoose = require("mongoose");


const RoomSchema = new mongoose.Schema({
    hostel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Hostel", 
    }, 
    roomNumber: { 
        type: String, 
        required: true, 
    },
    roomType: { 
        type: String, 
        enum: ["single", "double", "triple"], 
        required: true 
    },
    occupied: { 
        type: Boolean, 
        default: false 
    },
    students: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;