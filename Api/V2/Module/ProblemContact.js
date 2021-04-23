const ProblemContactRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

ProblemContactRouter.get('/all/:delete', (req, res, next) => {
    const page = req.headers.page;
    let sqlString = `select * from ProblemContact where deleted = ${req.params.delete}`;
    if (page) {
        const offset = (parseInt(page) - 1) * 9;
        sqlString += ` ORDER by id DESC LIMIT 9 OFFSET ${offset}`;
    }
    database.all(sqlString, (error, mails) => {
        if (error) {
            next(error);
        } else if (mails) {
            res.status(200).json({ mails: mails });
        } else {
            res.sendStatus(404);
        }
    })
})
ProblemContactRouter.get('/count/:delete', (req, res, next) => {
    database.get(`select COUNT(*) as amount from ProblemContact where deleted= ${req.params.delete}`, (error, amount) => {
        if (error) {
            next(error);
        } else if (amount) {
            res.status(200).json({ amount: amount });
            next();
        } else {
            res.sendStatus(404);
            next();
        }
    })
})
ProblemContactRouter.put('/read/:id', (req, res, next) => {
    database.get(`select id from Accounts where username = '${req.headers.username}' and password='${req.headers.password}' and type =1`, (error, account) => {
        if (error) {
            next(error);
        } else if (account) {
            var d = new Date();
            const receiveAt = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
            database.run(`update ProblemContact set read=1, read_by = ${account.id}, read_at='${receiveAt}' where id = ${req.params.id}`, (error) => {
                if (error) {
                    next(error);
                } else {
                    res.status(200).json({ message: 'success' })
                }
            })
        } else {
            res.sendStatus(404);

        }
    })
})
ProblemContactRouter.delete('/delete/:id', (req, res, next) => {
    const user = req.body.user;
    if (!user) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username = '${user.username}' and password='${user.password}' and type =1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                database.run(`delete from ProblemContact  where id = ${req.params.id}`, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        res.status(200).json({ message: 'success' })
                    }
                })
            } else {
                res.sendStatus(404);

            }
        })
    }
})
ProblemContactRouter.get('/problem/:id', (req, res, next) => {
    database.get(`select * from ProblemContact where id = ${req.params.id}`, (error, problem) => {
        if (error) {
            next(error);
        } else if (problem) {
            res.status(200).json({ problem: problem });
        } else {
            res.sendStatus(404);
        }
    })
})
module.exports = ProblemContactRouter;