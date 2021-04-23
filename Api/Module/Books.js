const express = require('express');
const BooksRouter = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

BooksRouter.get('/book', (req, res, next) => {
    const bookRoutine = req.headers.bookroutine;
    if (!bookRoutine) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from Books where deleted=0 and routine = '${bookRoutine}'`, (error, book) => {
            if (error) {
                next(error);
            } else if (book) {
                res.status(200).json({ book: book });
            }
        })
    }
});
BooksRouter.get('/book-comments', (req, res, next) => {
    const bookId = req.headers.bookid;
    const commentParent = req.headers.cmtparent;
    if (!bookId || !commentParent) {
        return res.sendStatus(400);
    } else {
        database.all(`select * from Comments where book_id=${bookId} and re_comment = ${commentParent} and deleted = 0`, (error, comments) => {
            if (error) {
                next(error);
            } else if (comments) {
                res.status(200).json({ comments: comments });
            } else {
                res.sendStatus(404);
            }
        })
    }
})
BooksRouter.get('/book-name-comment', (req, res, next) => {
    const accountId = req.headers.accountid;
    database.get(`select name from Accounts where deleted=0 and id = ${accountId}`, (error, name) => {
        if (error) {
            next(error);
        } else if (name) {
            res.status(200).json({ name: name });
        } else {
            res.sendStatus(404);
        }
    })
})
BooksRouter.get('/get-bought-books', (req, res, next) => {
    const id = req.headers.id;
    if (!id) {
        return res.sendStatus(400);
    } else {
        database.all(`select Books.* from Books inner join Bought on Books.id = Bought.book_id 
        where Bought.account_id = ${id} and Books.deleted = 0 order by Books.id desc`, (error, books) => {
            if (error) {
                next(error);
            } else if (books) {
                res.status(200).json({ books: books });
            } else {
                res.sendStatus(404);
            }
        })
    }
});
BooksRouter.get('/get-book-by-id', (req, res, next) => {
    const bookId = req.headers.bookid;
    if (!bookId) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from Books where deleted = 0 and id = ${bookId}`, (error, book) => {
            if (error) {
                next(error);
            } else if (book) {
                res.status(200).json({ book: book });
            } else {
                res.sendStatus(404);
            }
        })
    }
})
module.exports = BooksRouter;