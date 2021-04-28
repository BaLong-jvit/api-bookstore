const express = require('express');
const AccountsRouter = express.Router();
const sqlite = require('sqlite3');
const database = new sqlite.Database(process.env.TEST_DATABASE || './database.sqlite');

AccountsRouter.get('/check-account', (req, res, next) => {
    const adminuser = req.headers.adminuser;
    const adminpass = req.headers.adminpass;
    if (!adminuser || !adminpass) {
        return res.sendStatus(400);
    } else {
        database.get(`select * from Accounts where username = '${adminuser}' and password = '${adminpass}' and deleted = 0 and type = 1`, (error, account) => {
            if (error) {
                next(error);
            } else if (account) {
                res.status(200).json({ message: 'success' });
            } else {
                res.status(200).json({ message: 'failed' });
            }
        })
    }
})
AccountsRouter.get('/all/:delete',(req,res,next)=>{
    const page = req.headers.page;
    let sqlString = `Select * from Accounts where type = 2 and deleted = ${req.params.delete} `;
    if(page) {
        const offset = (parseInt(page) - 1) * 9;
        sqlString += `ORDER by id DESC LIMIT 9 OFFSET ${offset}`;
    }
    database.all(sqlString, (error, accounts)=>{
        if(error) {
            next(error);
        } else if(accounts) {
            res.status(200).json({accounts:accounts});
        } else {
            res.sendStatus(404);
        }
    })
})
AccountsRouter.get('/count/:delete',(req,res,next)=>{
    database.get(`select COUNT(*) as amount from Accounts where deleted = ${req.params.delete}`,(error, amount)=>{
        if(error){
            next(error);
        }else if (amount){
            res.status(200).json({amount:amount});
        }else {
            res.sendStatus(404);
        }
    })
})
AccountsRouter.get('/get/:id',(req,res,next)=>{
    database.get(`select * from Accounts where id = ${req.params.id} and deleted = 0`,(error, account)=>{
        if(error){
            next(error);
        }else if (account){
            res.status(200).json({account:account});
        }else{
            res.sendStatus(404);
        }
    })
})
AccountsRouter.put('/delete/:id',(req,res,next)=>{
    const data = req.body.data;
    if(!data){
        return res.sendStatus(400);
    }else{
        database.get(`select id from Accounts where username = '${data.username}' and password = '${data.password}' and type = 1`,(error,account)=>{
            if(error){
                next(error);
            }else if (account){
                var d = new Date();
                const receiveAt = d.getDate() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + d.getFullYear();
                database.run(`update Accounts set deleted = 1, deleted_by = ${account.id}, deleted_at = '${receiveAt}' where id = ${req.params.id}`,(error)=>{
                    if(error){
                        next(error);
                    }else{
                        res.status(200).json({message: 'success'})
                    }
                })
            }else{
                res.sendStatus(404);
            }
        })
    }
})
AccountsRouter.put('/convert/:id',(req,res,next)=>{
    const data = req.body.data;
    if(!data){
        return res.sendStatus(400);
    }else{
        database.get(`select id from Accounts where username = '${data.username}' and password = '${data.password}' and type = 1`,(error,account)=>{
            if(error){
                next(error);
            }else if (account){
               database.run(`update Accounts set deleted = 0, deleted_by = null, deleted_at = null where id = ${req.params.id} and deleted=1`,(error)=>{
                    if(error){
                        next(error);
                    }else{
                        res.status(200).json({message: 'success'})
                    }
                })
            }else{
                res.sendStatus(404);
            }
        })
    }
})
module.exports = AccountsRouter;