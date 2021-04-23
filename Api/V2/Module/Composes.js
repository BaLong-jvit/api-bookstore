const ComposesRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

ComposesRouter.put('/update-compose', (req, res, next) => {
    const listCompose = req.body.composes;
    database.run(`delete from Compose where book_id = ${listCompose.id}`, (error) => {
        if (error) {
            next(error);
        } else {
            var composeSql = `insert into Compose (artist_id, book_id) values `;
            for (let i = 0; i < listCompose.composes.length; i++) {
                if (i === listCompose.composes.length - 1) {
                    composeSql += `(${listCompose.composes[i].id}, ${listCompose.id});`;
                } else {
                    composeSql += `(${listCompose.composes[i].id}, ${listCompose.id}),`;
                }
            }
            database.run(composeSql, (error) => {
                if (error) {
                    next(error);
                } else {
                    res.status(202).json({ message: 'success' });
                }
            })
        }
    })
})

module.exports = ComposesRouter;