const express = require('express');
const PublishersRouter = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

PublishersRouter.get('/publisher', (req, res, next) => {
    const publisherId = req.headers.publisherid;
    if (!publisherId) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from Publishers where id = ${publisherId} and deleted = 0 `, (error, publisher) => {
            if (error) {
                next(error);
            } else if (publisher) {
                res.status(200).json({ publisher: publisher });
            } else {
                res.sendStatus(404);
            }
        })
    }
})
module.exports = PublishersRouter;