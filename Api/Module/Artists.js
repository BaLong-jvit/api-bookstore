const express = require('express');
const ArtistsRouter = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

ArtistsRouter.get('/', (req, res, next) => {
    database.all('select * from Artists where deleted = 0', (error, artists) => {
        if (error) {
            next(error);
        } else if (artists) {
            res.status(200).json({ artists: artists });
            next();
        } else {
            res.sendStatus(404);
        }
    })
});
ArtistsRouter.get('/artists', (req, res, next) => {
    const bookId = req.headers.bookid;
    if (!bookId) {
        return res.sendStatus(400);
    } else {
        database.all(`select Artists.* from Artists inner join Compose on Artists.id = Compose.artist_id
    where Compose.book_id = ${bookId} and Artists.deleted=0`, (error, artists) => {
            if (error) {
                next(error);
            } else if (artists) {
                res.status(200).json({ artists: artists });
            } else {
                res.sendStatus(404);
            }
        })
    }

})
ArtistsRouter.get('/list-items', (req, res, next) => {
    const categoryRoutine = req.headers.categoryroutine;
    const offset = (parseInt(req.headers.page) - 1) * 9;
    database.get(`select * from Artists where deleted = 0 and routine = '${categoryRoutine}'`, (error, artist) => {
        if (error) {
            next(error);
        } else if (artist) {
            database.all(`select * from Compose 
            inner join Books 
            on Compose.book_id = Books.id 
            where artist_id = ${artist.id} and Books.deleted = 0 order by Books.id desc limit 9 offset ${offset}`, (error, items) => {
                if (error) {
                    next();
                } else if (items) {
                    res.status(200).json({ items: items });
                    next();
                } else {
                    res.sendStatus(404);
                }
            })
        } else {
            res.sendStatus(404);
        }
    })
})

ArtistsRouter.get('/count-item', (req, res, next) => {
    const categoryRoutine = req.headers.categoryroutine;
    database.get(`select * from Artists where deleted = 0 and routine = '${categoryRoutine}'`, (error, artist) => {
        if (error) {
            next(error);
        } else if (artist) {
            database.get(`select COUNT(*) as amount from Compose 
            inner join Books 
            on Compose.book_id = Books.id 
            where artist_id = ${artist.id} and Books.deleted = 0`, (error, amount) => {
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
ArtistsRouter.get('/name-cat', (req, res, next) => {
    const categoryRoutine = req.headers.categoryroutine;
    database.get(`select name from Artists where deleted = 0 and routine = '${categoryRoutine}'`, (error, name) => {
        if (error) {
            next(error);
        } else if (name) {
            res.status(200).json({ name: name })
        } else {
            res.sendStatus(404);
        }
    })
})

module.exports = ArtistsRouter;