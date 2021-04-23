const express = require('express');
const BookImages = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

BookImages.get('/main', (req, res, next) => {
    const bookId = req.headers.bookid;
    database.get(`select * from BookImages where deleted = 0 and main = 0 and book_id = ${bookId}`,
        (error, image) => {
            if (error) {
                next(error);
            } else if (image) {
                res.status(200).json({ mainImage: image });
                next();
            } else {
                res.send({ mainImage: {} });
                next();
            }
        });
});

BookImages.get('/support', (req, res, next) => {
    const bookId = req.headers.bookid;
    database.all(`select * from BookImages where deleted = 0 and book_id = ${bookId}`, (error, images) => {
        if (error) {
            next(error);
        } else if (images) {
            res.status(200).json({ spImages: images });
            next();
        } else {
            res.send({ spImages: {} });
            next();
        }
    })
})

module.exports = BookImages;