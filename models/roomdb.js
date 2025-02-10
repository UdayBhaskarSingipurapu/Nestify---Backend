const mongoose = require("mongoose");


const RoomSchema = new mongoose.Schema({
    hostel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Hostel", 
        required: true 
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
    capacity: { 
        type: Number, 
        required: true 
    },
    occupied: { 
        type: Number, 
        default: 0 
    },
    students: [
        { 
            type: mongoose.Schema.
            Types.ObjectId, ref: "User" 
        }
    ], 
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;