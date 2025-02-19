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
    image: {
        url : String,
        filename : String,
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
    fees : {
        type : Number,
        required : true
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Owner",  
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    visitors : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Visitor"
        }
    ],
    maintainanceRequests : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Maintenance"
        }
    ]
});

const Hostel = mongoose.model("Hostel", HostelSchema);

module.exports = Hostel;