const express = require('express');
const V3Router = express();

V3Router.get('/', (req, res, next) => {
    res.send('this is api for admin user');
});

module.exports = V3Router;