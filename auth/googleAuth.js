const router = require('express').Router();
const passport = require('passport');
const passportSetup = require('../configPassport/passport-setup');

router.get('/', passport.authenticate('google', {
    scope : ['profile', 'email']
}))

router.get('/callback', passport.authenticate('google'), (req, res) => {
    res.send('hello');
})

module.exports = router;