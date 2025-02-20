const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const OwnerSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    googleId: String,
    email: { 
        type: String, 
        required: true,  
    },
    contact : {
        type: String, 
        required: true, 
        match: [/^\d{10}$/, "Enter a valid contact number"]
    },
    role: { 
        type: String, 
        enum: ["owner"], 
        default: "owner" 
    }, 
    hostels : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Owner"
        }
    ]
});

OwnerSchema.plugin(passportLocalMongoose);

const Owner = mongoose.model("Owner", OwnerSchema);

module.exports = Owner;