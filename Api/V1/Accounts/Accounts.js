const express = require('express');
const AccountsRouter = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

AccountsRouter.get('/get-image', (req, res, next) => {
    const accountId = req.headers.accountid;
    if (!accountId) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from AccountImages where deleted=0 and account_id=${accountId}`, (error, image) => {
            if (error) {
                next(error);
            } else if (image) {
                res.status(200).json({ image: image });
            } else {
                res.sendStatus(404);
            }
        })
    }
})
AccountsRouter.get('/check-login', (req, res, next) => {
    const username = req.headers.username;
    const password = req.headers.password;
    if (!username || !password) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from Accounts where deleted = 0 and type = 2 and username = '${username}' and password = '${password}'`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                res.status(200).json({ message: 'success' });
            } else {
                res.status(200).json({ message: 'failure' });
            }
        })
    }
});
AccountsRouter.get('/get-account', (req, res, next) => {
    const username = req.headers.username;
    const password = req.headers.password;
    if (!username || !password) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from Accounts where deleted = 0 and type = 2 and username = '${username}' and password = '${password}'`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                res.status(200).json({ account: account });
            } else {
                res.sendStatus(404);
            }
        })
    }
})
module.exports = AccountsRouter;