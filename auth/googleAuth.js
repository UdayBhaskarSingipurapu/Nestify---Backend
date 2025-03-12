const router = require("express").Router();
const passport = require("passport");
require('../config/passport-setup');
require("dotenv").config();

router.get(
    "/",
    passport.authenticate("google", { 
        scope: ["profile", "email"] 
    })
);

router.get(
    "/callback",
    passport.authenticate("google", { session: true }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Google authentication failed" });
        }
        const user  = req.user;
        console.log(user);
        res.json({
            message: "Google login successful",
            payload : user,
        });
    }
);

module.exports = router;