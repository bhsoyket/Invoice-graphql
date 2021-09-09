const mongoose = require('mongoose');
require('dotenv').config();

const connectionURI = process.env.MONGODB_URI;

module.exports = {
  connection() {
    return mongoose.connect(connectionURI, { useNewUrlParser: true, useUnifiedTopology: true });
  },
};