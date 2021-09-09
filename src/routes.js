const router					=	require('express').Router();
const health					=	require('./controllers/health');
const auth	                    =	require('./controllers/auth.controller');
const {isLoggedIn}	            =	require('./middlewares/auth');

const passport = require('passport');


// System Routes
router.get('/', health.loopback);
router.get('/health', health.check);

// Auth Routes
router.get('/auth/google', auth.login);
router.get('/auth/google/callback', auth.callback);
router.get('/success', isLoggedIn, auth.success);
router.get('/logout', auth.logout);
router.get('/auth/google/failure', auth.failure);




module.exports = router;