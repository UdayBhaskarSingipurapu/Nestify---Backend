const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true
    },
    googleId: String,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true, 
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    contact: {
        type: String, 
        required: true, 
        match: [/^\d{10}$/, "Enter a valid contact number"]
    },
    role: { 
        type: String, 
        enum: ["student"], 
        default: "student" 
    },
    room: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Room" 
    },
    parentName : {
        type : String,
        required : true
    },
    parentContact : {
        type: String, 
        required: true, 
        match: [/^\d{10}$/, "Enter a valid contact number"]
    },
    visitors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor"
        }
    ],
    maintenanceRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Maintenance"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports = User;
