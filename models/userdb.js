const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true, 
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
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
    feesPaid: { 
        type: Boolean, 
        default: false 
    },
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema)

module.exports = User;