const express = require('express');
const sqlite3 = require('sqlite3');
const AdvertRouter = express.Router();
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

AdvertRouter.get('/', (req, res, next) => {
    res.send('this page return api of advert');
});
AdvertRouter.get('/adverts/:delete', (req, res, next) => {
    database.all(`select * from Adverts where deleted = ${req.params.delete}`, (error, adverts) => {
        if (error) {
            next(error);
        } else if (adverts) {
            res.status(200).json({ adverts: adverts });
        } else {
            res.sendStatus(404);
        }
    })
});

AdvertRouter.get('/image', (req, res, next) => {
    database.get(`select * from AdvertImages where deleted = 0 and main=0 and advert_id = $id`, { $id: req.headers.advertid }, (error, image) => {
        if (error) {
            next(error);
        } else if (image) {
            res.status(200).json({ image: image });
        } else {
            res.sendStatus(404);
        }
    })
})

module.exports = AdvertRouter;