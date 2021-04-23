const PublishersRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

PublishersRouter.get('/publisher', (req, res, next) => {
    const publisherId = req.headers.publisherid;
    if (!publisherId) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from Publishers where id = ${publisherId} and deleted = 0 `, (error, publisher) => {
            if (error) {
                next(error);
            } else if (publisher) {
                res.status(200).json({ publisher: publisher });
            } else {
                res.sendStatus(404);
            }
        })
    }
})
PublishersRouter.get('/all/:delete', (req, res, next) => {
    const page = req.headers.page;
    let sqlString = `select * from Publishers where deleted=${req.params.delete}`;
    if (page) {
        const offset = (parseInt(page) - 1) * 9;
        sqlString += ` ORDER by id DESC LIMIT 9 OFFSET ${offset}`;
    }
    database.all(sqlString, (error, publishers) => {
        if (error) {
            next(error);
        } else if (publishers) {
            res.status(200).json({ publishers: publishers });
        } else {
            res.sendStatus(404);
        }
    })
})
PublishersRouter.get('/count/:delete', (req, res, next) => {
    database.get(`select COUNT(*) as amount from Publishers where deleted= ${req.params.delete}`, (error, amount) => {
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
PublishersRouter.put('/delete-publisher', (req, res, next) => {
    const data = req.body.dataupdate;
    if (!data) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username ='${data.username}' and password = '${data.password}' and type =1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                database.all(`select * from Books where publisher_id= ${data.publisher}`, (error, item) => {
                    if (error) {
                        next(error);
                    } else if (item.length) {
                        res.status(200).json({ message: 'error' });
                    } else {
                        var d = new Date();
                        const receiveAt = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
                        database.run(`update Publishers set deleted=1 , deleted_by = ${account.id}, deleted_at = '${receiveAt}' where id = ${data.publisher}`, (error) => {
                            if (error) {
                                next(error);
                            } else {
                                database.get(`select * from Publishers where id = ${data.publisher}`, (error, publisher) => {
                                    if (error) {
                                        next(error);
                                    } else if (publisher) {
                                        res.status(200).json({ message: 'success' });
                                    } else {
                                        res.status(200).json({ message: 'failed' });
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
})
PublishersRouter.put('/convert-publisher', (req, res, next) => {
    const dataUpdate = req.body.dataupdate;
    if (!dataUpdate) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username ='${dataUpdate.username}' and password = '${dataUpdate.password}' and type = 1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {

                database.run(`update Publishers set deleted = 0, deleted_by = NULL, deleted_at = NULL where id = ${dataUpdate.publisher}`, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        database.get(`select * from Publishers where id = ${dataUpdate.publisher}`, (error, book) => {
                            if (error) {
                                next(error);
                            } else if (book) {
                                res.status(200).json({ message: 'success' });
                            } else {
                                res.status(200).json({ message: 'failed' });
                            }
                        })
                    }
                })
            } else {
                res.sendStatus(404);
            }
        })
    }
})
PublishersRouter.delete('/del-publisher', (req, res, next) => {
    const publisher = req.headers.publisher;
    const user = req.headers.username;
    const pass = req.headers.password;
    if (!publisher || !user || !pass) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username ='${user}' and password = '${pass}' and type = 1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                database.all(`select * from Books where publisher_id = ${publisher}`, (error, books) => {
                    if (error) {
                        next(error);
                    } else if (books.length) {
                        res.status(200).json({ message: 'failed' });
                    } else {
                        database.run(`delete from Publishers where id = ${publisher}`, (error) => {
                            if (error) {
                                next(error);
                            } else {
                                res.status(200).json({ message: 'success' });
                            }
                        })

                    }
                })
            } else {
                res.sendStatus(404);
            }
        })
    }
})
PublishersRouter.put('/update-publisher', (req, res, next) => {
    const dataUpdate = req.body.data;
    if (!dataUpdate) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username ='${dataUpdate.username}' and password ='${dataUpdate.password}' and type = 1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                var d = new Date();
                const receiveAt = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
                database.run(`update Publishers set name = '${dataUpdate.name}', update_by = ${account.id}, update_at='${receiveAt}' where id = ${dataUpdate.publisher}`, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        res.status(200).json({ message: 'success' });
                    }
                })
            } else {
                res.sendStatus(404);
            }
        })
    }
})
PublishersRouter.post('/add', (req, res, next) => {
    const dataUpdate = req.body.data;
    if (!dataUpdate) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username ='${dataUpdate.username}' and password ='${dataUpdate.password}' and type = 1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                var d = new Date();
                const routine = removeNameToRoutine(dataUpdate.name) + `-${d.getTime()}`;
                const receiveAt = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
                database.run(`insert into Publishers (
                    name,
                    routine,
                    create_by,
                    create_at
                    ) values (
                        '${dataUpdate.name}',
                        '${routine}',
                        ${account.id},
                        '${receiveAt}'
                    )`, (error) => {
                    if (error) {
                        next(error);
                    } else {
                        res.status(200).json({ message: 'success' });
                    }
                })
            } else {
                res.sendStatus(404);
            }
        })
    }
})
function removeNameToRoutine(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "a");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "e");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "i");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "o");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "u");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "y");
    str = str.replace(/Đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ /g, '-');
    return str;
}
module.exports = PublishersRouter;