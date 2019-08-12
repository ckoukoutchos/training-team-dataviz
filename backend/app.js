const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use react build file 
app.use(express.static(path.join(__dirname, 'build')));

// serve react bundle for base url
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept, x-access-token');
    next();
});

const auth = require('./auth/auth-mw');
const cycle = require('./domains/cycle/cycle-router');
app.use('/api/cycle', auth, cycle);

/**
 * Called if requested route does not match provided routes.
 * @type {middleware}
 */
app.use(function (req, res) {
    res.status(404).send(`${req.url} endpoint not found`);
});

module.exports = app;