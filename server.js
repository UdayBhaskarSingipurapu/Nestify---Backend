const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();  
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userdb');
const userRouter = require('./API/userApi');
const session = require('express-session');

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
    saveUninitialized: false
}));

// Passport configuration for user authentication
app.use(passport.initialize());                         
app.use(passport.session());                            
passport.use(new LocalStrategy(User.authenticate()));   

passport.serializeUser(User.serializeUser());           
passport.deserializeUser(User.deserializeUser());


app.use('/user', userRouter);

app.listen((port), () => {
    console.log(`Server is running on ${port}`);
})