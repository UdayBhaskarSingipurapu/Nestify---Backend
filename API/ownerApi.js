const express = require('express');
const router = express.Router({ mergeParams: true });
const multer  = require('multer')
const {storage} = require("../config/cloudConfig");
const upload = multer({ storage });
const {
    validateLogin,
    validateSignup,
    logout,
    getOwner,
    editPassword,
    editPersonal,
    editProfileImage,
} = require('../controllers/ownerController/Owner')
const { validateOwner } = require('../middlewares/validateOwner');
const wrapAsync = require('../utils/wrapAsync');
const Owner = require('../models/admindb');


router.post('/signup', upload.single("profileImage"), validateOwner, wrapAsync(validateSignup));

router.post('/login', wrapAsync(validateLogin));

router.get('/all', async (req, res) => {
    let owners = await Owner.find();
    res.send({ message: "All users", payload: owners });
});

router.get('/logout', logout);

router.get('/:id', wrapAsync(getOwner));

router.put('/edit/:id/personal', wrapAsync(editPersonal));

router.put('/edit/:id/profileImage', upload.single("profileImage"), wrapAsync(editProfileImage));

router.put('/edit/:id/password', wrapAsync(editPassword))


module.exports = router;