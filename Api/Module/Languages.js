const express = require('express');
const LanguagesRouter = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

LanguagesRouter.get('/', (req, res, next) => {
    database.all('select * from Languages where deleted = 0', (error, languages) => {
        if (error) {
            next(error);
        } else if (languages) {
            res.status(200).json({ languages: languages });
            next();
        } else {
            res.sendStatus(404);
        }
    })
});

LanguagesRouter.get('/list-items', (req, res, next) => {
    const categoryRoutine = req.headers.categoryroutine;
    const offset = (parseInt(req.headers.page) - 1) * 9;
    database.get(`select * from Languages where deleted = 0 and routine = '${categoryRoutine}'`, (error, language) => {
        if (error) {
            next(error);
        } else if (language) {
            database.all(`select * from ConnectLang inner join Books 
            on ConnectLang.book_id = Books.id 
            where Books.deleted = 0 and ConnectLang.language_id = ${language.id} order by Books.id desc limit 9 offset ${offset}`, (error, items) => {
                if (error) {
                    next(error);
                } else if (items) {
                    res.status(200).json({ items: items });
                } else {
                    res.sendStatus(404);
                }
            });
        } else {
            res.sendStatus(404);
            next();
        }
    })
})

LanguagesRouter.get('/count-item', (req, res, next) => {
    const categoryRoutine = req.headers.categoryroutine;
    database.get(`select * from Languages where deleted = 0 and routine = '${categoryRoutine}'`, (error, language) => {
        if (error) {
            next(error);
        } else if (language) {
            database.get(`select COUNT(*) as amount from ConnectLang inner join Books 
            on ConnectLang.book_id = Books.id 
            where Books.deleted = 0 and ConnectLang.language_id = ${language.id}`, (error, amount) => {
                if (error) {
                    next(error);
                } else if (amount) {
                    res.status(200).json({ amount: amount });
                } else {
                    res.sendStatus(404);
                }
            })
        } else {
            res.sendStatus(404);
        }
    })
})
LanguagesRouter.get('/name-cat', (req, res, next) => {
    const categoryRoutine = req.headers.categoryroutine;
    database.get(`select name from Languages where deleted = 0 and routine = '${categoryRoutine}'`, (error, name) => {
        if (error) {
            next(error);
        } else if (name) {
            res.status(200).json({ name: name });
        } else {
            res.sendStatus(404);
        }
    })
})
module.exports = LanguagesRouter;