const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/userdb');
const bcrypt = require('bcryptjs');
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

router.get('/all', async(req, res) => {
    let users = await User.find();
    res.send({message : "All users", payload : users});
})

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
        const { username, email, password } = req.body; 
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;

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