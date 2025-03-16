const express = require('express');
const router = express.Router({ mergeParams: true });
const multer  = require('multer')
const User = require('../models/userdb');
const passport = require('passport');
const {storage, cloudinary} = require("../config/cloudConfig");
const upload = multer({ storage });
require('../models/hostelJoindb')
const {
    validateLogin,
    validateSignup,
    logout,
    getUser,
    editPassword,
    editPersonal,
    editProfileImage,
} = require("../controllers/userController/User.js");
const { validateUser } = require('../middlewares/validateUser.js');
const wrapAsync = require('../utils/wrapAsync.js')


router.post('/signup', upload.single("profileImage"), validateUser, wrapAsync(validateSignup));


router.post('/login', wrapAsync(validateLogin));


router.get('/logout', logout);

router.get('/:id', wrapAsync(getUser))

router.put('/edit/:id/personal', wrapAsync(editPersonal));

router.put('/edit/:id/profileImage', upload.single("profileImage"), wrapAsync(editProfileImage));

router.put('/edit/:id/password', wrapAsync(editPassword))


module.exports = router;