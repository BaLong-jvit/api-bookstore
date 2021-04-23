const AdvertImages = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');
var multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, res, cd) {
        cd(null, './src/image/advert')
    },
    filename: function (req, file, cd) {
        let imgName = crypto.createHash('md5').update(req.headers.imgname).digest('hex');
        cd(null, imgName + '.png')
    }
})
var upload = multer({ storage: storage });

AdvertImages.get('/advert/:main/:id', (req, res, next) => {
    database.get(`select * from AdvertImages where advert_id = ${req.params.id} and main = ${req.params.main}`, (error, image) => {
        if (error) {
            next(error);
        } else if (image) {
            res.status(200).json({ image: image })
        } else {
            res.sendStatus(404);
        }
    })
})
AdvertImages.post('/add/:main/:id', upload.single('file'), (req, res, next) => {
    let username = req.headers.username;
    let password = req.headers.password;
    database.get(`select id from Accounts where username ='${username}' and password = '${password}' and type = 1 and deleted=0`, (error, account) => {
        if (error) {
            next(error);
        } else if (account) {
            let imgName = crypto.createHash('md5').update(req.headers.imgname).digest('hex') + '.png';
            var d = new Date();
            let receiveAt = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
            database.run(`insert into AdvertImages (
                name, path, advert_id, main, create_by, create_at
            ) values (
                '${imgName}', 'advert', ${req.params.id}, ${req.params.main}, ${account.id}, '${receiveAt}'
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
AdvertImages.get('/advert/:main/:id', (req, res, next) => {
    database.get(`select * from AdvertImages where main = ${req.params.main} and advert_id = ${req.params.id}`, (error, image) => {
        if (error) {
            next(error);
        } else if (image) {
            res.status(200).json({ image: image });
        } else {
            res.sendStatus(404)
        }
    })
})
AdvertImages.post('/update/:main/:id', upload.single('file'), (req, res, next) => {
    let user = req.headers.username;
    let pass = req.headers.password;
    database.get(`select id from Accounts where username ='${user}' and password = '${pass}' and type = 1 and deleted=0`, (error, account) => {
        if (error) {
            nexr(error);
        } else if (account) {
            database.get(`select name from AdvertImages where id = ${req.params.id} and main = ${req.params.main}`, (error, img) => {
                if (error) {
                    next(error);
                } else if (img) {
                    fs.unlink(`./src/image/advert/${img.name}`, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    })
                    let imgName = crypto.createHash('md5').update(req.headers.imgname).digest('hex') + '.png';
                    var d = new Date();
                    let receiveAt = (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
                    database.run(`update AdvertImages set 
                        name = '${imgName}',
                        update_by=${account.id},
                        update_at='${receiveAt}'
                        where id = ${req.params.id} and main = 0 `, (error) => {
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
module.exports = AdvertImages;