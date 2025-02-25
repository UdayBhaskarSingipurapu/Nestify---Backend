const express = require('express');
const router = express.Router({ mergeParams: true });
const multer  = require('multer')
const User = require('../models/userdb');
const passport = require('passport');
const {storage, cloudinary} = require("../cloudConfig.js");
const upload = multer({ storage });


router.post('/signup', upload.single("profileImage"), async (req, res) => {
    console.log(req.body.profileImage)
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


router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(401).json({ message: "User not found" });
    
        const isValid = await user.authenticate(req.body.password);
        if (!isValid) return res.status(401).json({ message: "Incorrect password" });
        req.login(user, (err) => { // Manually log in
            if (err) return res.status(500).json({ message: "Login failed", err });
            res.status(200).json({ message: "User logged in successfully", payload : user });
        });
    } catch (error) {
        res.status(500).json({ message: "Database error", error });
    }
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
    let user = await User.findById(id);
    if(!user){
        res.send({message : "User not found"});
    }
    res.send({message : "user", payload : user});
})

router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const { username, email, password, contact } = req.body; 
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (contact) user.contact = contact;
        if (password) {
            await user.setPassword(password); 
        }

        await user.save().then((res) => {
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


module.exports = router;