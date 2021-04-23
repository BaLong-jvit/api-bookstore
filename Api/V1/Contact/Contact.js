const express = require('express');
const ContactRouter = express.Router();
const sqlite3 = require('sqlite3');
const database = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

ContactRouter.get('/get-contact-infor', (req, res, next) => {
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


ContactRouter.post('/problem-contact', (req, res, next) => {
    const name = req.body.problem.name;
    const email = req.body.problem.email;
    const subject = req.body.problem.subject;
    const message = req.body.problem.message;
    var d = new Date();
    const receiveAt = d.getDate() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
    if (!name || !email || !subject || !message) {
        return res.sendStatus(400);
    } else {
        const value = {
            $name: name,
            $email: email,
            $subject: subject,
            $message: message,
            $receiveAt: receiveAt
        };
        database.run(`insert into ProblemContact (name, email,subject,message,receive_at) VALUES (
            $name, $email, $subject, $message, $receiveAt
        )`, value, function (error) {
            if (error) {
                next(error);
            } else {
                database.get(`Select * from ProblemContact where id = ${this.lastID}`, (error, row) => {
                    if (error) { next(error) }
                    res.status(201).json({ problem: row });
                })
            }
        })
    }
})

module.exports = ContactRouter;