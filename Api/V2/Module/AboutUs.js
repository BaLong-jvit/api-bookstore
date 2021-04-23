const AboutUsRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

const crypto = require('crypto');
const fs = require('fs');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, res, cd) {
        cd(null, './src/image/aboutus')
    },
    filename: function (req, file, cd) {
        let imgName = crypto.createHash('md5').update(req.headers.imgname).digest('hex');
        cd(null, imgName + '.png')
    }
})
var upload = multer({ storage: storage });

AboutUsRouter.get('/all/:delete', (req, res, next) => {
    database.all(`select * from AboutUs where deleted =${req.params.delete}`, (error, about) => {
        if (error) {
            next(error);
        } else if (about) {
            res.status(200).json({ about: about })
        } else {
            res.sendStatus(404);
        }
    })
})
AboutUsRouter.delete('/delete/:id', (req, res, next) => {
    const user = req.body.user;
    if (!user) {
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username = '${user.username}' and password = '${user.password}' and type = 1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                database.get(`select image_name from AboutUs where id =${req.params.id}`, (error, image) => {
                    if (error) {
                        next(error);
                    } else if (image) {
                        fs.unlink(`./src/image/aboutus/${image.image_name}`, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        })
                        database.run(`delete from AboutUs where id = ${req.params.id}`, (error) => {
                            if (error) {
                                next(error);
                            } else {
                                res.status(200).json({ message: 'success' })
                            }
                        })
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
AboutUsRouter.post('/add', (req, res, next) => {
    const data = req.body.data;
    if (!data) {
        return res.sendStatus(400)
    } else {
        database.get(`select id from Accounts where username='${data.username}' and password = '${data.password}' and type=1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                var d = new Date();
                const receiveAt = d.getDate() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
                database.run(`insert into AboutUs (name, content, image_name, routine, note_image, position, deleted, create_by, create_at) values (
                    '${data.name}',
                    '${data.content}',
                    'img_name',
                    'aboutus',
                    '${data.note}',
                    (SELECT max(position) from AboutUs where deleted = 0) + 1,
                    0,
                    ${account.id},
                    '${receiveAt}'
                )`, function (error) {
                    if (error) {
                        next(error);
                    } else {
                        database.get(`select * from AboutUs where id =${this.lastID}`, (error, about) => {
                            if (error) {
                                next(error);
                            } else if (about) {
                                res.status(200).json({ about: about })
                            } else {
                                res.sendStatus(404);
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
AboutUsRouter.post('/image/:id', upload.single('file'), (req, res, next) => {
    const username = req.headers.username;
    const password = req.headers.password;
    database.get(`select id from Accounts where username='${username}' and password = '${password}' and type=1`, (error, account) => {
        if (error) {
            next(error);
        } else if (account) {
            let imgName = crypto.createHash('md5').update(req.headers.imgname).digest('hex') + '.png';
            database.run(`update AboutUs set image_name = '${imgName}' where id = ${req.params.id}`, error => {
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
module.exports = AboutUsRouter;