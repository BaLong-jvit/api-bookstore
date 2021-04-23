const StatusRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');
StatusRouter.get('/all', (req, res, next) => {
    database.all(`select * from Status where 1`, (error, status) => {
        if (error) {
            next(error);
        } else if (status) {
            res.status(200).json({ status: status });
        } else {
            res.sendStatus(404);
        }
    })
})
module.exports = StatusRouter;