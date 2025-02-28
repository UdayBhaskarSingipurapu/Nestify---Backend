const passport = require('passport');
const User = require('../models/userdb');
const Owner = require('../models/admindb');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require("dotenv").config();

passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role }); 
});

passport.deserializeUser(async (data, done) => {
    try {
        let user;
        if (data.role === 'owner') {
            user = await Owner.findById(data.id);  
        } else {
            user = await User.findById(data.id);   
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5050/auth/google/callback",
        passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const userType = request.query.userType; 
            if (userType === "owner") {
                let owner = await Owner.findOne({ googleId: profile.id });
                if (!owner) {
                    owner = new Owner({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        role: "owner"
                    });
                    await owner.save();
                }

                return done(null, owner);

            } else { 
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        role: "user"
                    });
                    await user.save();
                }

                return done(null, user);
            }
        } 
        catch (err) {
            return done(err, null);
        }
    }
));