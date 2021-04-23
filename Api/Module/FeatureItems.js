const express = require('express');
const FeatureItems = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

FeatureItems.get('/list-items', (req, res, next) => {
    const offset = (parseInt(req.headers.page) - 1) * 9;
    database.all(`select * from Books where deleted = 0 ORDER by id DESC LIMIT 9 OFFSET ${offset}`, (error, items) => {
        if (error) {
            next(error);
        } else if (items) {
            res.status(200).json({ items: items });
            next();
        } else {
            res.sendStatus(404);
        }
    })
})

FeatureItems.get('/count-item', (req, res, next) => {
    database.get(`select COUNT(*) as amount from Books where deleted= 0`, (error, amount) => {
        if (error) {
            next(error);
        } else if (amount) {
            res.status(200).json({ amount: amount });
            next();
        } else {
            res.sendStatus(404);
            next();
        }
    })
})

module.exports = FeatureItems;