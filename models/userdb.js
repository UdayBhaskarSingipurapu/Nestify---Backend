const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type : String,
        // required : true
    },
    googleId: String,
    email: { 
        type: String, 
        // required: true, 
        // unique: true, 
        trim: true, 
        lowercase: true, 
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    profileImage : {
        url : String,
        filename : String,
    },
    contact: {
        type: String, 
        // required: true, 
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
        // required : true
    },
    parentContact : {
        type: String, 
        // required: true, 
        match: [/^\d{10}$/, "Enter a valid contact number"]
    },
    maintenanceRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Maintenance"
        }
    ],
    hostelRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "hostelJoinRequest"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports = User;
