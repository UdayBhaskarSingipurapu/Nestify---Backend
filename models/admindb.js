const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name: { 
            type: String, 
            required: true 
        },
    email: { 
        type: String, 
        required: true,  
    },
    role: { 
        type: String, 
        enum: ["admin"], 
        default: "admin" 
    }, 
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;