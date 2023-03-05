'use strict'

require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cors = require('cors')
const routes = require('./app/routes');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (_, res) => {
  res.send('Hello world');
})

app.use('/', routes);
// error handler
app.use(function (err, req, res, next) {
    // 404 Not Found.
    if (err.status === 404) {
      return res
        .status(404)
    }

    // 500 Internal Server Error (in production, all other errors send this response).
    if (req.app.get('env') !== 'development') {
      return res
        .status(500)
    }

    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
})

const db = require("./app/models");

// force: true drops existing tables and re-sync database
db.sequelize.sync({ force: process.env.NODE_ENV == 'development' })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Start listening.
app.listen(PORT, async () => {
    console.log('Server started on http://localhost:3000')
    console.log('Press Ctrl-C to terminate...')
})

module.exports = app
