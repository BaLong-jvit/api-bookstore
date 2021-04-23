const express = require('express');
const V1Router = express();

const HomeRouter = require('./Home/Home');
const ContactRouter = require('./Contact/Contact');
const AboutUsRouter = require('./AboutUs/AboutUs');
const ShopsRouter = require('./Shops/Shops');
const BlogRoutine = require('./Blog/Blog');
const AccountsRouter = require('./Accounts/Accounts');
const AdvertRouter = require('./Adverts/Adverts');
const BooksRouter = require('../Module/Books');
const BookImages = require('../Module/BookImages');
const ArtistsRouter = require('../Module/Artists');
const PublishersRouter = require('../Module/Publishers');
const SearchsRouter = require('../Module/Searchs');
const CartsRouter = require('./Carts/Carts');
const CommentsRouter = require('../Module/Comments');
const BillsRouter = require('../Module/Bills');

V1Router.get('/', (req, res, next) => {
    res.send('this is api for public user');
});

V1Router.use('/home', HomeRouter);

V1Router.use('/contact', ContactRouter);

V1Router.use('/about-us', AboutUsRouter);

V1Router.use('/shops', ShopsRouter);

V1Router.use('/blog', BlogRoutine);

V1Router.use('/accounts', AccountsRouter);

V1Router.use('/adverts', AdvertRouter);

V1Router.use('/books', BooksRouter);

V1Router.use('/book-images', BookImages);

V1Router.use('/artists', ArtistsRouter);

V1Router.use('/publishers', PublishersRouter);

V1Router.use('/searchs', SearchsRouter);

V1Router.use('/carts', CartsRouter);
V1Router.use('/comments', CommentsRouter);
V1Router.use('/bills', BillsRouter);

module.exports = V1Router;