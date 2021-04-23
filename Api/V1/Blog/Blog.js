const express = require('express');
const BlogRoutine = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

BlogRoutine.get('/list-blogs', (req, res, next) => {
    const offset = (parseInt(req.headers.page) - 1) * 4;
    database.all(`select * from Blogs where deleted=0 ORDER by id DESC LIMIT 4 OFFSET ${offset}`, (error, blogs) => {
        if (error) {
            next(error);
        } else if (blogs) {
            res.status(200).json({ blogs: blogs });
        } else {
            res.sendStatus(404);
        }
    })
})
BlogRoutine.get('/blog-count', (req, res, next) => {
    database.get(`select COUNT(*) as amount from Blogs where deleted= 0`, (error, amount) => {
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
BlogRoutine.get('/blog-name-comment', (req, res, next) => {
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
BlogRoutine.get('/blog-artist-name', (req, res, next) => {
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
BlogRoutine.get('/get-blog-image', (req, res, next) => {
    const blogId = req.headers.blogid;
    database.get(`select * from BlogImages where blog_id = ${blogId} and deleted=0`, (error, image) => {
        if (error) {
            next(error);
        } else if (image) {
            res.status(200).json({ image: image });
        } else {
            res.sendStatus(404);
        }
    })
})
BlogRoutine.get('/get-blog', (req, res, next) => {
    const blogRoutine = req.headers.blogroutine;
    database.get(`select * from Blogs where routine ='${blogRoutine}' and deleted=0`, (error, blog) => {
        if (error) {
            next(error);
        } else if (blog) {
            res.status(200).json({ blog: blog });
        } else {
            res.sendStatus(404);
        }
    })
})
BlogRoutine.get('/get-comments', (req, res, next) => {
    const blogId = req.headers.blogid;
    const commentParent = req.headers.commentparent;

    if (!blogId || !commentParent) {
        return res.sendStatus(400);
    } else {
        database.all(`select * from CommentBlog where deleted=0 and blog_id=${blogId} and re_comment=${commentParent}`, (error, comments) => {
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
BlogRoutine.post('/add-comment', (req, res, next) => {
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
                database.run(`insert into CommentBlog (content, blog_id, re_comment, create_by, create_at) VALUES 
                    ('${newComment.content}', ${newComment.blogid}, ${newComment.re}, ${account.id}, '${receiveAt}')`, function (error) {
                    if (error) {
                        next(error);
                    } else {
                        database.get(`select * from CommentBlog where id = ${this.lastID}`, (error, comment) => {
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
module.exports = BlogRoutine;