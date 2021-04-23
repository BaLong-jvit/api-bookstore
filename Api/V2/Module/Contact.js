const ContactRouter = require('express').Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

ContactRouter.get('/contact', (req, res, next) => {
    database.get(`SELECT * from Contact where id = (SELECT max(id) from Contact where deleted =0)`, (error, contact) => {
        if (error) {
            next(error);
        } else if (contact) {
            res.status(200).json({ contact: contact });
        } else {
            res.sendStatus(404);
        }
    })
});
ContactRouter.put('/update/:id', (req, res, next) => {
    const data = req.body.data;
    if (!data) {
        console.log('ok');
        return res.sendStatus(400);
    } else {
        database.get(`select id from Accounts where username='${req.headers.username}' and password = '${req.headers.password}' and type = 1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                var d = new Date();
                const receiveAt = d.getDate() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
                database.run(`update Contact set
                name = '${data.name}',
                website = '${data.website}',
                address = ${data.address},
                street = '${data.street}',
                ward = '${data.ward}',
                district = '${data.district}',
                province = '${data.province}',
                country = '${data.country}',
                phonenumber = '${data.phonenumber}',
                email = '${data.email}',
                facebook='${data.facebook}',
                instagram ='${data.instagram}',
                twitter = '${data.twitter}',
                zalo = '${data.zalo}',
                youtube = '${data.youtube}',
                google = '${data.google}',
                create_by =${account.id},
                create_at ='${receiveAt}'
                where id = ${req.params.id}`, (error) => {
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
module.exports = ContactRouter;