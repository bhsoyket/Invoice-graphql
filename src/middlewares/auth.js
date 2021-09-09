const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const userType = require('../constant/user');

require('dotenv').config('.env');


module.exports.GoogleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
(async (accessToken, refreshToken, profile, cb) => {
  try {
    let user = await User.findOne({ google_id: profile.id }).lean();

    if (!user) {
      // create new user;
      const profileImage = profile.photos ? profile.photos[0].value : null;
      const email = profile.emails ? profile.emails[0].value : null;

      const payload = {
        google_id: profile.id,
        name: profile.displayName,
        image: profileImage,
        email,
        userType: [userType.user],
      };
      user = await User.create(payload);
    }

    cb(null, user);
  } catch (e) {
    cb(e, null);
  }
}));


module.exports.serializeUser = (user, done) => {
  done(null, user);
};


module.exports.deserializeUser = (user, done) => {
  done(null, user);
};


module.exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).send({
    success: false,
    message: 'Unauthorized',
  });
};