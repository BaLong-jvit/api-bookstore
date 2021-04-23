const ConnectLangRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

ConnectLangRouter.put('/update', (req, res, next) => {
    const listConnect = req.body.connects;
    database.run(`delete from ConnectLang where book_id = ${listConnect.id}`, (error) => {
        if (error) {
            next(error);
        } else {
            var connectSql = `insert into ConnectLang (language_id, book_id) values `;
            for (let i = 0; i < listConnect.connects.length; i++) {
                if (i === listConnect.connects.length - 1) {
                    connectSql += `(${listConnect.connects[i].id}, ${listConnect.id});`;
                } else {
                    connectSql += `(${listConnect.connects[i].id}, ${listConnect.id}),`;
                }
            }

            database.run(connectSql, (error) => {
                if (error) {
                    next(error);
                } else {
                    res.status(202).json({ message: 'success' });
                }
            })
        }
    })
})

module.exports = ConnectLangRouter;