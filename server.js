const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();  
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userdb');

const port = 8080
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

// Passport configuration for user authentication
app.use(passport.initialize());                         
app.use(passport.session());                            
passport.use(new LocalStrategy(User.authenticate()));   

passport.serializeUser(User.serializeUser());           
passport.deserializeUser(User.deserializeUser()); 


app.listen((port), () => {
    console.log(`Server is running on ${port}`);
})