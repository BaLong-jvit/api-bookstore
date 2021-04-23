const BillsRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

BillsRouter.post('/add', (req, res, next) => {
    const info = {
        name: req.headers.name,
        phone: req.headers.phone,
        address: req.headers.address,
        street: req.headers.street,
        ward: req.headers.ward,
        district: req.headers.district,
        city: req.headers.city
    };
    const user = {
        username: req.headers.username,
        password: req.headers.password
    };
    const data = req.body.data;
    if (!info || !user || !data) {
        return res.sendStatus(400);
    } else {
        database.get(`select name from Accounts where username ='${user.username}' and password= '${user.password}' and type =2`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                var createBy = account.name;
                let insertString = `insert into Bills (board_code, book_id, amount, create_by, phone, address, street, ward, district, city) values `;
                for (let i = 0; i < data.length; i++) {
                    let boardCode = '0' + data[i].book_id + Math.random().toString(10).substring(2, 13);

                    if (i === data.length - 1) {
                        insertString += `(
                            '${boardCode}',
                            ${data[i].book_id},
                            ${data[i].amount},
                            '${createBy}',
                            '${info.phone}',
                            '${info.address}',
                            '${info.street}',
                            '${info.ward}',
                            '${info.district}',
                            '${info.city}'
                        );`;
                    } else {
                        insertString += `(
                            '${boardCode}',
                            ${data[i].book_id},
                            ${data[i].amount},
                            '${createBy}',
                            '${info.phone}',
                            '${info.address}',
                            '${info.street}',
                            '${info.ward}',
                            '${info.district}',
                            '${info.city}'
                        ),`;
                    }
                }
                database.run(insertString, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        res.status(200).json({ message: 'success' })
                    }
                })
            } else {
                var createBy = info.name;
                let insertString = `insert into Bills (board_code, book_id, amount, create_by, phone, address, street, ward, district, city) values `;
                for (let i = 0; i < data.length; i++) {
                    let boardCode = '0' + data[i].book_id + Math.random().toString(10).substring(2, 13);

                    if (i === data.length - 1) {
                        insertString += `(
                            '${boardCode}',
                            ${data[i].book_id},
                            ${data[i].amount},
                            '${createBy}',
                            '${info.phone}',
                            '${info.address}',
                            '${info.street}',
                            '${info.ward}',
                            '${info.district}',
                            '${info.city}'
                        );`;
                    } else {
                        insertString += `(
                            '${boardCode}',
                            ${data[i].book_id},
                            ${data[i].amount},
                            '${createBy}',
                            '${info.phone}',
                            '${info.address}',
                            '${info.street}',
                            '${info.ward}',
                            '${info.district}',
                            '${info.city}'                            
                        ),`;
                    }
                }
                database.run(insertString, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        res.status(200).json({ message: 'success' })
                    }
                })
            }
        })
    }
})

module.exports = BillsRouter;