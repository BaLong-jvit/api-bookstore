const express = require('express');
const AccountsRouter = express.Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

AccountsRouter.get('/check-account', (req, res, next) => {
    const adminuser = req.headers.adminuser;
    const adminpass = req.headers.adminpass;
    if (!adminuser || !adminpass) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from Accounts where username = '${adminuser}' and password = '${adminpass}' and deleted = 0 and type = 1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                res.status(200).json({ message: 'success' });
            } else {
                res.status(200).json({ message: 'failed' });
            }
        })
    }
})

module.exports = AccountsRouter;