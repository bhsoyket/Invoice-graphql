  
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./db/db');
const { serializeUser, deserializeUser, GoogleStrategy, isLoggedIn } = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');

const corsOptions = {
  origin: true,
  methods: 'GET, POST, DELETE, PATCH, PUT, HEAD',
  credentials: true,
};

// connect DB
db.connection().then(() => {
  console.log('Database is connected');
}).catch((e) => {
  console.error(e);
});

const app = express();
require('dotenv').config()
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(morgan('dev'));

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
passport.use(GoogleStrategy);


if (process.env.NODE_ENV !== 'test') {
  app.use('/api/v1/*', isLoggedIn);
}
app.use(routes);



/**
 * Unhandled promise rejection handler
 */
 process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection at:', reason);
});

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
});

/**
 * 404 not found route
 */
 app.use((req, res) => res.status(404).send({ error: 'Not Found' }));
 app.use(errorHandler);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => { console.log(`Server is running on http//:${process.env.HOST}:${PORT} ...`); });