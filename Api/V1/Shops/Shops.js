const express = require('express');
const ShopsRouter = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

ShopsRouter.get('/get-local-shops', (req, res, next) => {
    database.all(`select DISTINCT city, routine_city from Shops where active = 0`, (error, localshop) => {
        if (error) {
            next(error);
        } else if (localshop) {
            res.status(200).json({ localshop: localshop });
        } else {
            res.sendStatus(404);
        }
    })
});
ShopsRouter.get(`/list-shop-in-local`, (req, res, next) => {
    const localRoutine = req.headers.localroutine;
    const condition = (localRoutine === 'tat-ca') ? ' where active = 0'
        : ` where active = 0 and routine_city ='${localRoutine}'`;
    const sql = `select * from Shops` + condition;
    database.all(sql, (error, shops) => {
        if (error) {
            next(error);
        } else if (shops) {
            res.status(200).json({ shops: shops });
        } else {
            res.sendStatus(404);
        }
    })
});
ShopsRouter.get('/name-local', (req, res, next) => {
    const localRoutine = req.headers.localroutine;
    if (localRoutine === 'tat-ca') {
        return res.status(202).json({ name: { city: '' } });
    } else (
        database.get(`select DISTINCT city from Shops where active = 0 and routine_city='${localRoutine}'`, (error, name) => {
            if (error) {
                next(error);
            } else if (name) {
                res.status(200).json({ name: name });
            } else {
                res.sendStatus(404);
            }
        })
    )
});

ShopsRouter.get('/get-main-image', (req, res, next) => {
    const idShop = req.headers.idshop;
    if (!idShop) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from ShopImages Where deleted=0 and main = 0 and shop_id= ${idShop}`, (error, image) => {
            if (error) {
                next(error);
            } else if (image) {
                res.status(200).json({ image: image });
            } else {
                res.sendStatus(404);
            }
        })
    }
});
ShopsRouter.get('/get-support-images', (req, res, next) => {
    const idShop = req.headers.idshop;
    if (!idShop) {
        return res.sendStatus(400);
    } else {
        database.all(`select * from ShopImages where deleted = 0 and main=1 and shop_id=${idShop}`, (error, images) => {
            if (error) {
                next(error);
            } else if (images) {
                res.status(200).json({ images: images });
            } else {
                res.sendStatus(404);
            }
        })
    }
})
module.exports = ShopsRouter;