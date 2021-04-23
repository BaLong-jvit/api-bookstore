const express = require('express');
const AccountsRouter = require('../Module/Accounts');
const LoginRouter = express.Router();

LoginRouter.use('/accounts', AccountsRouter);
module.exports = LoginRouter;