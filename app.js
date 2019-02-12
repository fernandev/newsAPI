const express = require('express');
const newsRoutes = require('./API/routes/news');

const app = express();

app.use('/news', newsRoutes);

module.exports = app;
