const express = require('express');
const HomeRouter = express();

const AdvertsRouter = require('../../Module/Adverts');
const ArtistsRouter = require('../../Module/Artists');
const CategoriesRouter = require('../../Module/Categories');
const FeatureItems = require('../../Module/FeatureItems');
const LanguagesRouter = require('../../Module/Languages');

HomeRouter.get('/', (req, res, next) => {
    res.send('this page return api for home page');
});

HomeRouter.use('/adverts', AdvertsRouter);

HomeRouter.use('/categories', CategoriesRouter);

HomeRouter.use('/artists', ArtistsRouter);

HomeRouter.use('/languages', LanguagesRouter);

HomeRouter.use('/feature-items', FeatureItems);

// thieu tap, recommend

module.exports = HomeRouter;