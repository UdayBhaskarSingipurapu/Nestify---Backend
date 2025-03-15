const mongoose = require('mongoose');

const hostelJoinSchema = new mongoose.Schema({
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    hostel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Hostel"
    },
    status : {
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

const hostelJoinRequest = mongoose.model("hostelJoinRequest", hostelJoinSchema);

module.exports = hostelJoinRequest;