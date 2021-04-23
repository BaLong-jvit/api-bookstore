const express = require('express');
const CartsRouter = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

CartsRouter.post('/insert-book', (req, res, next) => {
    const user = req.body.insert.username;
    const pass = req.body.insert.password;
    const bookId = req.body.insert.bookid;
    if (!user || !pass || !bookId) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where deleted = 0 and username = '${user}' and password = '${pass}'`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                //set truong hop bam vo nhieu lan
                database.get(`select * from Carts where book_id = ${bookId} and create_by =${account.id}`, (error, cart) => {
                    if (error) {
                        next(error);
                    } else if (cart) {
                        const amount = parseInt(cart.amount) + 1;
                        database.run(`update Carts set amount = ${amount} where id= ${cart.id}`, function (error) {
                            if (error) {
                                next(error);
                            } else {
                                database.get(`select * from Carts where id = ${cart.id}`, (error, cart2) => {
                                    if (error) {
                                        next(error);
                                    } else {
                                        res.status(201).json({ cart: cart2 });
                                    }
                                })
                            }
                        })
                    } else {
                        database.run(`insert into Carts (book_id,create_by) values (${bookId}, ${account.id})`, function (error) {
                            if (error) {
                                next(error);
                            } else {
                                database.get(`select * from Carts where id = ${this.lastID}`, (error, cart) => {
                                    if (error) {
                                        next(error);
                                    } else {
                                        res.status(201).json({ cart: cart });
                                    }
                                })
                            }
                        })
                    }
                })

            } else {
                res.sendStatus(404);
            }
        })
    }
});
CartsRouter.get('/get-carts', (req, res, next) => {
    const username = req.headers.username;
    const password = req.headers.password;
    if (!username || !password) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where deleted = 0 and username = '${username}' and password = '${password}'`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                database.all(`select * from Carts where create_by = ${account.id}`, (error, carts) => {
                    if (error) {
                        next(error);
                    } else if (carts) {
                        res.status(200).json({ carts: carts });
                    } else {
                        res.sendStatus(404)
                    }
                })
            } else {
                res.sendStatus(404);
            }
        })
    }
})
CartsRouter.delete('/delete-cart', (req, res, next) => {
    database.run(`delete from Carts where id = ${req.headers.id}`, (error) => {
        if (error) {
            next(error)
        } else {
            res.status(200).json({ mess: 'ok' });
        }
    })
})
CartsRouter.put('/update-amount', (req, res, next) => {
    const dataUpdate = req.body.dataUpdate;
    if (!dataUpdate) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username='${dataUpdate.username}' and password = '${dataUpdate.password}' and deleted=0`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                database.run(`update Carts set amount = ${dataUpdate.amount} where book_id=${dataUpdate.bookid} and create_by=${account.id}`, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        database.get(`select * from Carts where book_id=${dataUpdate.bookid} and create_by=${account.id}`, (error, cart) => {
                            if (error) {
                                next(error);
                            } else if (cart) {
                                res.status(200).json({ cart: cart });
                            } else {
                                res.sendStatus(404);
                            }
                        })
                    }
                })
            } else {
                res.status(200).json({ message: 'fail' });
            }
        })
    }
})
CartsRouter.delete('/delete-all', (req, res, next) => {
    const user = req.body.user;
    if (!user) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username='${user.username}' and password = '${user.password}' and deleted=0`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                database.run(`delete from Carts where create_by = ${account.id}`, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        res.status(200).json({ message: 'success' })
                    }
                })
            } else {
                res.status(200).json({ message: 'success' })
            }
        })
    }
})
module.exports = CartsRouter;