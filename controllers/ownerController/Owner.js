const passport = require('passport');
const Owner = require('../../models/admindb')
const Hostel = require('../../models/hosteldb')

const validateSignup = async (req, res) => {
    console.log(req.body.profileImage)
    console.log(req.file);
    let { username, email, password, contact } = req.body;
    let profileImage = req.file ? { url: req.file.path, filename: req.file.filename } : null;
    let newUser = new Owner({username, email, contact, profileImage});
    try {
        let registeredUser = await Owner.register(newUser, password);
        if (registeredUser) {
            return res.status(200).json({ message: "User registered successfully", payload: registeredUser });
        }
    } catch (err) {
        console.log(err);
        res.status(401).json({message : "Something went wrong", payload : err});
    }
}

const validateLogin = async (req, res, next) => {
    passport.authenticate('owner-local', async (err, user, info) => {
        if (err) return res.status(500).json({ message: 'Authentication error', error: err });
        if (!user) return res.status(401).json({ message: info.message });
        req.login(user, async (loginErr) => {
            if (loginErr) return res.status(500).json({ message: 'Session error', error: loginErr });
            try {
                console.log(user)
                const hostels = await Hostel.find({ owner: user._id });
                return res.status(200).json({ 
                    message: 'Owner logged in successfully', 
                    payload: { user, hostels } 
                });
            } catch (dbErr) {
                return res.status(500).json({ message: "Error fetching hostels", error: dbErr });
            }
        });
    })(req, res, next);
}

const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            res.send({ message: "Error", payload: err });
        } else {
            res.send({ message: "Success", payload: "Logged out successfully" });
        }
    });
}

const getOwner = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await Owner.findById(id).populate("hostels");
        if (!user) {
            res.status(404).send({ message: "User not found" });
        } else {
            return res.status(200).json({ message: "User found", payload: user });
        }
    } catch (err) {
        res.status(500).send({ message: "Error retrieving user", payload: err });
    }
}

const editPersonal =  async (req, res) => {
    try {

        console.log(req.body);
        const { id } = req.params; 
        const { username, email, contact } = req.body; 
        const user = await Owner.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (contact) user.contact = contact;
        await user.save();
        res.status(200).json({ message: 'User updated successfully', payload: user });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const editProfileImage = async (req, res) => {
    try {
        let { id } = req.params;
        const user = await Owner.findById(id);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(req.file) {
            user.profileImage = { url: req.file.path, filename: req.file.filename };
        }
        await user.save();
        res.status(200).json({ message: "Profile image updated successfully", payload : user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const editPassword =  async(req, res) => {
    try {
        console.log(req.body);
        let { id } = req.params;
        const user = await Owner.findById(id);
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

module.exports = {validateLogin, validateSignup, logout, getOwner, editPassword, editPersonal, editProfileImage};
