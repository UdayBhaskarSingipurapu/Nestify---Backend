const express = require('express');
const router = express.Router({ mergeParams: true });
const multer  = require('multer')
const User = require('../models/userdb');
const passport = require('passport');
const {storage, cloudinary} = require("../config/cloudConfig");
const upload = multer({ storage });
const userValidationSchema = require('../validateSchema/user/validateUser.js')


router.post('/signup', upload.single("profileImage"), userValidationSchema, async (req, res) => {
    console.log(req.file);
    let { username, email, password, contact, parentName, parentContact } = req.body;
    let profileImage = req.file ? { url: req.file.path, filename: req.file.filename } : null;
    let newUser = new User({username, email, contact, profileImage, parentName, parentContact});
    try {
        let registeredUser = await User.register(newUser, password);
        if(registeredUser){
            return res.status(200).json({ message: "User registered successfully", payload: registeredUser });
        }
    } catch(err){
        res.status(500).json({message : "Something went wrong", payload : err});
    }
});


router.post('/login', (req, res, next) => {
    passport.authenticate('user-local', (err, user, info) => {
        if (err) return res.status(500).json({ message: 'Authentication error', error: err });
        if (!user) return res.status(401).json({ message: info.message });
        req.login(user, (loginErr) => {
            if (loginErr) return res.status(500).json({ message: 'Session error', error: loginErr });
            return res.status(200).json({ message: 'User logged in successfully', payload : user });
        });
    })(req, res, next);
});





// router.get('/all', async(req, res) => {
//     let users = await User.find();
//     res.send({message : "All users", payload : users});
// })

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err){
            res.send({message : "error", payload : err});
        } else {
            res.send({message : "success", payload : "logged out successfully"})
        }
    })
});

router.get('/:id', async ( req, res) => {
    let {id} = req.params;
    let user = await User.findById(id).populate("maintenanceRequests");
    if(!user){
        res.send({message : "User not found"});
    }
    res.send({message : "user", payload : user});
})

router.put('/edit/:id/personal', async (req, res) => {
    try {
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

        user.save().then((res) => {
            res.json({ message: 'User updated successfully', user: user });
        })
        .catch((err) => {
            res.json({message : "invalid credentials", error : err})
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/edit/:id/profileImage', upload.single("profileImage"), async (req, res) => {
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
        res.status(200).json({ message: "Profile image updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put('/edit/:id/password', async(req, res) => {
    try {
        let { id } = req.params;
        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let {password} = req.body;
        await user.setPassword(password);
        await user.save();
        return res.status(200).json({message : "Password updated successfully", payload : user});
    }
    catch(err) {
        return res.status(500).json({message : "Internal Server Error"});
    }
})


module.exports = router;