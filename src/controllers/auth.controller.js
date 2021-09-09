
const passport = require('passport');

module.exports.login = passport.authenticate('google', { scope: [ 'email', 'profile' ] });

module.exports.logout = (req, res) => {
    req.session.destroy();
    req.logout();
    return res.redirect('/');
};

module.exports.callback = passport.authenticate( 'google', {
        successRedirect: '/success',
        failureRedirect: '/auth/google/failure'
});

module.exports.success = (req, res) => {
    res.send({
        message: 'Login Successfull',
        data: req.user,
    });
}

module.exports.failure = (req, res) => {
    res.status(401).send({message: 'Failed to authenticate..'});
}
