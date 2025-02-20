const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
    }, 
    addressLine : {
        doorNo :{
            type : String,
            required : true
        },
        street :{
            type : String,
            required : true
        },
        city :{
            type : String,
            required : true
        },
        state : {
            type : String,
            required : true
        }
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