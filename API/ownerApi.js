const express = require('express');
const router = express.Router({ mergeParams: true });
const multer  = require('multer')
const Owner = require('../models/admindb');
const passport = require('passport');
const {storage} = require("../config/cloudConfig");
const upload = multer({ storage });
const ownerValidationSchema = require('../validateSchema/admin/validateAdmin')

router.post('/signup', upload.single("profileImage"), ownerValidationSchema, async (req, res) => {
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
});

router.post('/login', (req, res, next) => {
    passport.authenticate('owner-local', (err, user, info) => {
        if (err) return res.status(500).json({ message: 'Authentication error', error: err });
        if (!user) return res.status(401).json({ message: info.message });
        req.login(user, (loginErr) => {
            if (loginErr) return res.status(500).json({ message: 'Session error', error: loginErr });
            return res.status(200).json({ message: 'User logged in successfully', payload : user });
        });
    })(req, res, next);
});

router.get('/all', async (req, res) => {
    let owners = await Owner.find();
    res.send({ message: "All users", payload: owners });
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            res.send({ message: "Error", payload: err });
        } else {
            res.send({ message: "Success", payload: "Logged out successfully" });
        }
    });
});

router.get('/:id', async (req, res) => {
    let { id } = req.params;
    try {
        let user = await Owner.findById(id).populate("hostels");
        if (!user) {
            res.status(404).send({ message: "User not found" });
        } else {
            return res.status(200).json({ message: "User found", payload: user });
        }
    } catch (err) {
        res.status(500).send({ message: "Error retrieving user", payload: err });
    }
});

router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const user = await Owner.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        if (password) {
            await user.setPassword(password, (err) => {
                if (err) return res.status(500).json({ message: 'Password update failed', error: err });
            });
        }

        await user.save();
        res.json({ message: 'User updated successfully', user: user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;