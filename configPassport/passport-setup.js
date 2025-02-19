const passport = require('passport');
const User = require('../models/userdb');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require("dotenv").config(); 


passport.serializeUser((user, done) => {
    done(null, user.id);  
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);  
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5050/auth/google/callback",
        passReqToCallback   : true
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                });
                await user.save();
            }
            return done(null, user);
        } 
        catch (err) {
            return done(err, null);
        }
    }
));