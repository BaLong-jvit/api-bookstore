const BillsRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

BillsRouter.get('/all/:status', (req, res, next) => {
    const page = req.headers.page;
    let sqlString = `Select * from Bills `;
    if (req.params.status == 10) {
        sqlString += `where 1 `;
    } else {
        sqlString += `where status = ${req.params.status} `;
    }
    if (page) {
        const offset = (parseInt(page) - 1) * 20;
        sqlString += `ORDER by id DESC LIMIT 20 OFFSET ${offset}`;
    }
    database.all(sqlString, (error, bills) => {
        if (error) {
            next(error);
        } else if (bills) {
            res.status(200).json({ bills: bills });
        } else {
            res.sendStatus(404);
        }
    })
})

BillsRouter.get('/count/:status', (req, res, next) => {
    let sqlString = `select COUNT(*) as amount from Bills `;
    if (req.params.status == 10) {
        sqlString += `where 1 `;
    } else {
        sqlString += `where status = ${req.params.status} `;
    }
    database.get(sqlString, (error, amount) => {
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

BillsRouter.put('/update/:id', (req, res, next) => {
    const data = req.body.data;
    if (!data) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username='${data.username}' and password = '${data.password}' and type =1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                database.run(`update Bills set 
                    create_by = '${data.name}',
                    phone = '${data.phone}',
                    address ='${data.address}',
                    street = '${data.street}',
                    ward = '${data.ward}',
                    district = '${data.district}',
                    city = '${data.city}',
                    status = ${data.status}
                    where id = ${req.params.id}
                `, (error) => {
                    if (error) {
                        next(error)
                    } else {
                        res.status(202).json({ message: 'success' });
                    }
                })
            } else {
                res.sendStatus(404)
            }
        })
    }
})

module.exports = BillsRouter;