const express = require('express');
const AboutUsRouter = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

AboutUsRouter.get('/items', (req, res, next) => {
    database.all(`select * from AboutUs Where deleted = 0 order by position asc`, (error, items) => {
        if (error) {
            next(error);
        } else if (items) {
            res.status(200).json({ items: items });
        } else {
            res.sendStatus(404);
        }
    })
})
module.exports = AboutUsRouter;