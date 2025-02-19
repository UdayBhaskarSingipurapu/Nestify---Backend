const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();  
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userdb');
const userRouter = require('./API/userApi');
const ownerApi = require('./API/ownerApi')
const session = require('express-session');
const Owner = require('./models/admindb');
const googleAuthRouter = require('./auth/googleAuth');
const ExpressError = require('./utils/ExpressError');


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
passport.use(new LocalStrategy(User.authenticate()));   

passport.serializeUser(User.serializeUser());           
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(Owner.authenticate()));   

passport.serializeUser(Owner.serializeUser());           
passport.deserializeUser(Owner.deserializeUser());


app.use('/user', userRouter);
app.use('/owner', ownerApi);
app.use('/auth/google', googleAuthRouter);



app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));        // Passes a 404 error to the error-handling middleware
  });
  
  // Error-handling middleware
  app.use((err, req, res, next) => {
    const { message = "Something went wrong", statusCode = 500 } = err; // Extracts error details
    res.render("error.ejs", { message, statusCode });     // Renders an error page
  });


app.listen((port), () => {
    console.log(`Server is running on ${port}`);
})