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
    roomCapacity: { 
        type: Number,
        required: true 
    },
    airConditioned: { 
        type: Boolean, 
        default: false 
    },
    fees : {
        type : Number,
        required : true
    }, 
    occupied :{
        type: Number,
        default : 0
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