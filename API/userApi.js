const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/userdb');
const passport = require('passport');


router.post('/signup', async (req, res) => {
    let { username, email, password } = req.body;
    let newUser = new User({username, email});
    try {
        let registeredUser = await User.register(newUser, password);
        if(registeredUser){
            res.send({message : "User registered successfully", payload : registeredUser});
        }
    } catch(err){
        res.send({message : "User registeration unsuccessfull", payload : err});
    }

});

router.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "Error during authentication", payload: err });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials", payload: info });
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) {
                return res.status(500).json({ message: "Login failed", payload: loginErr });
            }
            return res.status(200).json({ message: "User logged in successfully", payload: user });
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err){
            res.send({message : "error", payload : err});
        } else {
            res.send({message : "success", payload : "logged out successfully"})
        }
    })
});


module.exports = router;