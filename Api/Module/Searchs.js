const express = require('express');
const SearchsRouter = express.Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

SearchsRouter.get('/get-book', (req, res, next) => {
    const keyWord = req.headers.keyword;
    console.log(keyWord);
    if (!keyWord) {
        return res.sendStatus(400);
    } else {
        database.all(`select * from Books where deleted = 0 and name like '%${keyWord}%' order by id desc`, (error, results) => {
            if (error) {
                next(error);
            } else if (results) {
                res.status(200).json({ results: results });
            } else {
                res.sendStatus(404);
            }
        })
    }
})

module.exports = SearchsRouter;