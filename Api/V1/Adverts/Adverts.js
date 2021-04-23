const express = require('express');
const sqlite3 = require('sqlite3');
const AdvertRouter = express.Router();
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

AdvertRouter.get('/advert', (req, res, next) => {
    const advertRoutine = req.headers.advertroutine;
    database.get(`select * from Adverts where deleted = 0 and path = '${advertRoutine}'`, (error, advert) => {
        if (error) {
            next(error);
        } else if (advert) {
            res.status(200).json({ advert: advert });
        } else {
            res.sendStatus(404);
        }
    })
})

AdvertRouter.get('/banner-image', (req, res, next) => {
    database.get(`select * from AdvertImages where deleted = 0 and main=1 and advert_id = $id`, { $id: req.headers.advertid }, (error, image) => {
        if (error) {
            next(error);
        } else if (image) {
            res.status(200).json({ image: image });
        } else {
            res.sendStatus(404);
        }
    })
})

AdvertRouter.get(`/list-books`, (req, res, next) => {
    const advertId = req.headers.advertid;
    const offset = (parseInt(req.headers.page) - 1) * 9;
    database.all(`select Books.* from Books inner join BooksAdvert on Books.id = BooksAdvert.book_id 
                    where BooksAdvert.advert_id=${advertId} and Books.deleted = 0 
                    order by Books.id desc limit 9 offset ${offset}`, (error, books) => {
        if (error) {
            next(error);
        } else if (books) {
            res.status(200).json({ books: books });
        } else {
            res.sendStatus(404);
        }
    })
})
AdvertRouter.get('/get-count', (req, res, next) => {
    const advertId = req.headers.advertid;
    database.get(`select COUNT(*) as amount from Books INNER JOIN BooksAdvert on Books.id = BooksAdvert.book_id
    WHERE BooksAdvert.advert_id = ${advertId} and Books.deleted = 0`, (error, amount) => {
        if (error) {
            next(error);
        } else if (amount) {
            res.status(200).json({ amount: amount });
        } else {
            res.sendStatus(404);
        }
    })
})
module.exports = AdvertRouter;