const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",   
    }, 
    hostel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Hostel", 
    },
    visitorName: { 
        type: String, 
        required: true, 
        trim: true 
    }, 
    visitorContact: { 
        type: String, 
        required: true, 
        match: [/^\d{10}$/, "Enter a valid contact number"]
    },
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Visitor = mongoose.model("Visitor", VisitorSchema);

module.exports = Visitor;
