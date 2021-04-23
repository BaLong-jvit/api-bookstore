const express = require('express');
const LoginRouter = require('./Login/Login');
const AboutUsRouter = require('./Module/AboutUs');
const AdvertImages = require('./Module/AdvertImages');
const AdvertsRouter = require('./Module/Adverts');
const ArtistsRouter = require('./Module/Artists');
const BillsRouter = require('./Module/Bills');
const BookImagesRouter = require('./Module/BookImages');
const BooksRouter = require('./Module/Books');
const ComposesRouter = require('./Module/Composes');
const ConnectLangRouter = require('./Module/ConnectLang');
const ContactRouter = require('./Module/Contact');
const LanguagesRouter = require('./Module/Languages');
const ProblemContactRouter = require('./Module/ProblemContact');
const PublishersRouter = require('./Module/Publishers');
const StatusRouter = require('./Module/Status');
const V2Router = express();

V2Router.get('/', (req, res, next) => {
    res.send('this is api for client user');
});

V2Router.use('/login', LoginRouter);
V2Router.use('/books', BooksRouter);
V2Router.use('/book-images', BookImagesRouter);
V2Router.use('/artists', ArtistsRouter);
V2Router.use('/publishers', PublishersRouter);
V2Router.use('/composes', ComposesRouter);
V2Router.use('/languages', LanguagesRouter);
V2Router.use('/connect-lang', ConnectLangRouter);
V2Router.use('/adverts', AdvertsRouter);
V2Router.use('/advert-images', AdvertImages);
V2Router.use('/contact', ContactRouter);
V2Router.use('/about-us', AboutUsRouter);
V2Router.use('/problem-contact', ProblemContactRouter);
V2Router.use('/status', StatusRouter);
V2Router.use('/bills', BillsRouter)

module.exports = V2Router;