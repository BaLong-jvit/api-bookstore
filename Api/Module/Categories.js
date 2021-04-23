const express = require('express');
const CategoriesRouter = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

CategoriesRouter.get('/', (req, res, next) => {
    database.all(`select * from Categories where deleted = 0`, (error, categories) => {
        if (error) {
            next(error);
        } else if (categories) {
            res.status(200).json({ categories: categories });
            next();
        } else {
            res.sendStatus(404);
        }
    })
});

CategoriesRouter.get(`/list-items`, (req, res, next) => {
    const categoryRoutine = req.headers.categoryroutine;
    const offset = (parseInt(req.headers.page) - 1) * 9;
    database.get(`select * from Categories where deleted=0 and routine = '${categoryRoutine}'`, (error, category) => {
        if (error) {
            next(error);
        } else if (category) {
            database.all(`SELECT * from CateRela 
                            INNER JOIN Books on CateRela.book_id = Books.id 
                            where CateRela.cate_id = ${category.id} AND Books.deleted = 0 ORDER by CateRela.book_id DESC LIMIT 9 OFFSET ${offset}`,
                (error, items) => {
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
        }
    })
})
CategoriesRouter.get('/count-item', (req, res, next) => {
    const categoryRoutine = req.headers.categoryroutine;
    database.get(`select * from Categories where deleted = 0 and routine = '${categoryRoutine}'`, (error, category) => {
        if (error) {
            next(error);
        } else if (category) {
            database.get(`SELECT COUNT(*) as amount from CateRela 
            INNER JOIN Books on CateRela.book_id = Books.id 
            where CateRela.cate_id = ${category.id} AND Books.deleted = 0`, (error, amount) => {
                if (error) {
                    next(error);
                } else if (amount) {
                    res.status(200).json({ amount: amount });
                } else {
                    res.sendStatus(200);
                }
            })
        } else {
            res.sendStatus(404);
        }
    })
})
CategoriesRouter.get('/name-cat', (req, res, next) => {
    const categoryRoutine = req.headers.categoryroutine;
    database.get(`select name from Categories where deleted = 0 and routine = '${categoryRoutine}'`, (error, name) => {
        if (error) {
            next(error);
        } else if (name) {
            res.status(200).json({ name: name });
        } else {
            res.sendStatus(404);
        }
    })
})

module.exports = CategoriesRouter;