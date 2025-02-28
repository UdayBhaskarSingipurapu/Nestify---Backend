const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get(
    "/",
    passport.authenticate("google", { 
        scope: ["profile", "email"] 
    })
);

router.get(
    "/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Google authentication failed" });
        }
        const { user, token } = req.user;
        res.json({
            message: "Google login successful",
            user,
            token,
        });
    }
);

module.exports = router;
