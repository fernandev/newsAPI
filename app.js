const express = require('express');
const expressValidator = require('express-validator');

const newsRoutes = require('./API/routes/news');

const app = express();
app.use(expressValidator());

app.use('/news', newsRoutes);

module.exports = app;
