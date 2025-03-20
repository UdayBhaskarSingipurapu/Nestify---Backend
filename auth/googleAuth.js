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
        res.redirect(`https://nestify-client.vercel.app/log-in/success?user=${JSON.stringify(req.user)}`);
    }
);

module.exports = router;