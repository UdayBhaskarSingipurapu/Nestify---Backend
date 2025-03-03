const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",  
        
    }, 
    hostel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Hostel", 
        
    },
    issueTitle: { 
        type: String, 
        required: true, 
        trim: true 
    }, 
    issueDescription: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "in-progress", "resolved"], 
        default: "pending" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Maintenance = mongoose.model("Maintenance", MaintenanceSchema);

module.exports = Maintenance;
