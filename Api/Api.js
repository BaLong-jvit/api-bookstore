const express = require('express');
const ApiRouter = express();
const V1Router = require('./V1/V1');
const V2Router = require('./V2/V2');
const v3Router = require('./V3/V3');

ApiRouter.get('/', (req, res, next) => {
    res.send('not things here');
});

ApiRouter.use('/v1', V1Router); // public, khong cần account,
ApiRouter.use('/v2', V2Router); // user thường
ApiRouter.use('/v3', v3Router); // user admin



module.exports = ApiRouter;