const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');


app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler());

const ApiModule = require('./Api/Api');

app.get('/', (req, res, next) => res.send('Hello World!'));

app.get('/image/:folder/:imageName', (req, res, next) => {
    res.sendFile(path.join(__dirname + `/src/image/${req.params.folder}/${req.params.imageName}`));
});

app.use('/api', ApiModule);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is listening in: ${PORT}`);
});
module.exports = app;