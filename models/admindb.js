const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const OwnerSchema = new mongoose.Schema({
    username: { 
            type: String, 
            required: true 
        },
    email: { 
        type: String, 
        required: true,  
    },
    role: { 
        type: String, 
        enum: ["owner"], 
        default: "owner" 
    }, 
});

OwnerSchema.plugin(passportLocalMongoose);

const Owner = mongoose.model("Owner", OwnerSchema);

module.exports = Owner;