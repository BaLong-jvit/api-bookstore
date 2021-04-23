const express = require('express');
const CommentsRouter = express.Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

CommentsRouter.post('/add-comment', (req, res, next) => {
    const newComment = req.body.comment;

    if (!newComment) {
        return res.sendStatus(400);
    } else {

        database.get(`select id from Accounts where username = '${newComment.user}' and deleted = 0`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                var d = new Date();
                const receiveAt = d.getDate() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
                database.run(`insert into Comments (content, book_id, re_comment, create_by, create_at) VALUES 
                    ('${newComment.content}', ${newComment.bookid}, ${newComment.re}, ${account.id}, '${receiveAt}')`, function (error) {
                    if (error) {
                        next(error);
                    } else {
                        database.get(`select * from Comments where id = ${this.lastID}`, (error, comment) => {
                            if (error) {
                                next(error);
                            } else if (comment) {
                                res.status(200).json({ comment: comment });
                            } else {
                                res.sendStatus(404);
                            }
                        })
                    }
                })
            } else {
                res.sendStatus(404);
            }
        })

    }
})

module.exports = CommentsRouter;