const BookImagesRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');
var multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');


BookImagesRouter.get('/main-image', (req, res, next) => {
    let bookId = req.headers.bookid;
    if (!bookId) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from BookImages where book_id = ${bookId} and deleted= 0 and main = 0`, (error, image) => {
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

BookImagesRouter.get('/support-images', (req, res, next) => {
    let bookId = req.headers.bookid;
    if (!bookId) {
        return res.sendStatus(400);
    } else {
        database.all(`select * from BookImages where book_id = ${bookId} and deleted= 0 and main = 1`, (error, images) => {
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

var storage = multer.diskStorage({
    destination: function (req, res, cd) {
        cd(null, './src/image/product')
    },
    filename: function (req, file, cd) {
        let imgName = crypto.createHash('md5').update(req.headers.imgname).digest('hex');
        cd(null, imgName + '.png')
    }
})
var upload = multer({ storage: storage });
BookImagesRouter.post('/update-book-main', upload.single('file'), (req, res, next) => {
    let mainImageId = req.headers.mainimg;
    let user = req.headers.username;
    let pass = req.headers.password;
    database.get(`select id from Accounts where username ='${user}' and password = '${pass}' and type = 1 and deleted=0`, (error, account) => {
        if (error) {
            nexr(error);
        } else if (account) {
            database.get(`select name from BookImages where id = ${mainImageId} and main = 0`, (error, img) => {
                if (error) {
                    next(error);
                } else if (img) {
                    fs.unlink(`./src/image/product/${img.name}`, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    })
                    let imgName = crypto.createHash('md5').update(req.headers.imgname).digest('hex') + '.png';
                    var d = new Date();
                    let receiveAt = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
                    database.run(`update BookImages set 
                        name = '${imgName}',
                        update_by=${account.id},
                        update_at='${receiveAt}'
                        where id = ${mainImageId} and main = 0 `, (error) => {
                        if (error) {
                            next(error)
                        } else {
                            res.sendStatus(202);
                        }
                    })
                }
            })
        }
    })

})
BookImagesRouter.delete('/delete-sup-image', (req, res, next) => {
    let listData = req.body.data;

    let sql = `Delete from BookImages where`;
    let count = 0;
    for (let i = 0; i < listData.length; i++) {

        if (listData[i].deleted == 1) {
            fs.unlink(`./src/image/product/${listData[i].name}`, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            })
            count++;
            if (count > 1) {
                sql += ` or id= ${listData[i].id}`;
            } else {
                sql += ` id = ${listData[i].id}`;
            }

        }
    }
    database.run(sql, (error) => {
        if (error) {
            next(error);
        } else {
            res.status(202).json({ message: 'success' })
        }
    })
})

BookImagesRouter.post('/upload-sup-image', upload.single('file'), (req, res, next) => {
    let bookId = req.headers.bookid;
    let user = req.headers.username;
    let pass = req.headers.password;
    database.get(`select id from Accounts where username ='${user}' and password = '${pass}' and type = 1 and deleted=0`, (error, account) => {
        if (error) {
            next(error);
        } else if (account) {
            let imgName = crypto.createHash('md5').update(req.headers.imgname).digest('hex') + '.png';
            var d = new Date();
            let receiveAt = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
            database.run(`insert into BookImages (
                name, path, book_id, main, create_by, create_at
            ) values (
                '${imgName}', 'product', ${bookId}, 1, ${account.id}, '${receiveAt}'
            ) `, (error) => {
                if (error) {
                    next(error);
                } else {
                    res.status(202).json({ message: 'success' });
                }
            })
        } else {
            res.sendStatus(404);
        }
    })

})
BookImagesRouter.post('/add-main-image', upload.single('file'), (req, res, next) => {
    let bookId = req.headers.bookid;
    let user = req.headers.username;
    let pass = req.headers.password;
    database.get(`select id from Accounts where username ='${user}' and password = '${pass}' and type = 1 and deleted=0`, (error, account) => {
        if (error) {
            next(error);
        } else if (account) {
            let imgName = crypto.createHash('md5').update(req.headers.imgname).digest('hex') + '.png';
            var d = new Date();
            let receiveAt = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
            database.run(`insert into BookImages (
                name, path, book_id, main, create_by, create_at
            ) values (
                '${imgName}', 'product', ${bookId}, 0, ${account.id}, '${receiveAt}'
            ) `, (error) => {
                if (error) {
                    next(error);
                } else {
                    res.status(202).json({ message: 'success' });
                }
            })
        } else {
            res.sendStatus(404);
        }
    })
})
BookImagesRouter.post('/add-sup-image', upload.single('file'), (req, res, next) => {
    let bookId = req.headers.bookid;
    let user = req.headers.username;
    let pass = req.headers.password;
    database.get(`select id from Accounts where username ='${user}' and password = '${pass}' and type = 1 and deleted=0`, (error, account) => {
        if (error) {
            next(error);
        } else if (account) {
            let imgName = crypto.createHash('md5').update(req.headers.imgname).digest('hex') + '.png';
            var d = new Date();
            let receiveAt = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
            database.run(`insert into BookImages (
                name, path, book_id, main, create_by, create_at
            ) values (
                '${imgName}', 'product', ${bookId}, 1, ${account.id}, '${receiveAt}'
            ) `, (error) => {
                if (error) {
                    next(error);
                } else {
                    res.status(202).json({ message: 'success' });
                }
            })
        } else {
            res.sendStatus(404);
        }
    })
})
module.exports = BookImagesRouter;