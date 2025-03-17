const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();  
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userdb');
const userRouter = require('./API/userApi');
const ownerRouter = require('./API/ownerApi')
const session = require('express-session');
const Owner = require('./models/admindb');
const googleAuthRouter = require('./auth/googleAuth');
const ExpressError = require('./utils/ExpressError');
const reviewRouter = require('./API/reviewApi');
const appReviewRouter = require('./API/appReview');
const hostelRouter = require('./API/hostelAPI');
const maintainceRouter = require('./API/maintainanceApi');
const roomRouter = require('./API/roomApi');
const hostelJoinRouter = require('./API/hostelJoinApi')
const cors = require('cors');

app.get('/', (req, res) => {
    res.send("Nestify Running.....")
})

const port = 5050
main()
    .then((res) => {
        console.log("connection successful");              
    })
    .catch((err) => {
        console.log(err);                                   
    });

async function main() {
    await mongoose.connect(process.env.DB_URL);           
}

app.use(express.json());  // ✅ Parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // ✅ Parses URL-encoded bodies (form submissions)

app.use(cors({
    origin: "https://nestify-client-z2l2.vercel.app",  // Frontend URL
    credentials: true  // Allow cookies and authentication headers
}));

app.use(session({
    secret: process.env.SECRET,  // Change this to a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,      // Sets cookie expiration to 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,                    // Sets max cookie age to 7 days
        httpOnly: true,                                     // Ensures the cookie is accessible only by the web server
    },
}));

// Passport configuration for user authentication
app.use(passport.initialize());
app.use(passport.session());

// Custom serialization/deserialization
passport.serializeUser((user, done) => {
    done(null, { 
        _id: user._id,
        type: user instanceof User ? 'user' : 'owner' 
    });
});

passport.deserializeUser(async (obj, done) => {
    try {
        const model = obj.type === 'user' ? User : Owner;
        const user = await model.findById(obj._id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use('user-local', new LocalStrategy(User.authenticate()));
passport.use('owner-local', new LocalStrategy(Owner.authenticate()));


app.use('/user', userRouter);
app.use('/owner', ownerRouter);
app.use('/auth/google', googleAuthRouter);
app.use('/hostel', hostelRouter);
app.use('/hostel/review', reviewRouter);
app.use('/newAppReview', appReviewRouter);
app.use('/hostel/maintainance', maintainceRouter);
app.use('/room', roomRouter);
app.use('/joinHostel', hostelJoinRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));        // Passes a 404 error to the error-handling middleware
});

  // Error-handling middleware
app.use((err, req, res, next) => {
    const { message = "Something went wrong", statusCode = 500 } = err; // Extracts error details
    res.send({message , statusCode});     // Renders an error page
});

app.listen((port), () => {
    console.log(`Server is running on ${port}`);
})