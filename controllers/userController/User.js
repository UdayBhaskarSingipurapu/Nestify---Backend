const User = require('../../models/userdb.js')
const passport = require('passport');
require('../../models/hostelJoindb.js')

module.exports.validateSignup = async (req, res) => {
    try {
        let { username, email, password, contact, parentName, parentContact } = req.body;
        let profileImage = req.file ? { url: req.file.path, filename: req.file.filename } : null;

        let newUser = new User({ username, email, contact, profileImage, parentName, parentContact });

        let registeredUser = await User.register(newUser, password); // ✅ Correct usage of register
        return res.status(200).json({ message: "User registered successfully", payload: registeredUser });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


module.exports.validateLogin = (req, res, next) => {
    passport.authenticate('user-local', async (err, user, info) => {
        if (err) return next(err); // ✅ Pass to Express error handler

        if (!user) {
            return res.status(401).json({ message: info?.message || "Unauthorized" });
        }

        req.login(user, async (loginErr) => {
            if (loginErr) return next(loginErr); // ✅ Prevents multiple responses

            try {
                const populatedUser = await User.findById(user._id)
                    .populate("maintenanceRequests")
                    .populate({
                        path: "hostelRequests",
                        populate: { path: "hostel", model: "Hostel" }
                    });

                res.status(200).json({ message: 'User logged in successfully', payload: populatedUser });
            } catch (fetchErr) {
                console.log(fetchErr)
                next(fetchErr);
            }
        });
    })(req, res, next);
};




module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err){
            return res.send({message : "error", payload : err});
        } else {
            return res.send({message : "success", payload : "logged out successfully"})
        }
    })
}

module.exports.getUser = async ( req, res) => {
    let {id} = req.params;
    let user = await User.findById(id).populate("maintenanceRequests").populate("hostelRequests");
    if(!user){
        return res.send({message : "User not found"});
    }
    return res.send({message : "user", payload : user});
}

module.exports.editPersonal = async (req, res) => {
    try {

        console.log(req.body);
        const { id } = req.params; 
        const { username, email, contact, parentName, parentContact } = req.body; 
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (contact) user.contact = contact;
        if (parentName) user.parentName = parentName;
        if (parentContact) user.parentContact = parentContact;

        await user.save();
        return res.status(200).json({ message: 'User updated successfully', payload: user });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.editProfileImage = async (req, res) => {
    try {
        let { id } = req.params;
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(req.file) {
            user.profileImage = { url: req.file.path, filename: req.file.filename };
        }
        await user.save();
        return res.status(200).json({ message: "Profile image updated successfully", payload : user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.editPassword = async(req, res) => {
    try {
        console.log(req.body);
        let { id } = req.params;
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let {newPassword} = req.body;
        await user.setPassword(newPassword);
        await user.save();
        return res.status(200).json({message : "Password updated successfully", payload : user});
    }
    catch(err) {
        return res.status(500).json({message : "Internal Server Error"});
    }
}

