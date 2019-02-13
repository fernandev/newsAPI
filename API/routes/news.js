const express = require('express');
const NewsHandler = require('../handlers/news');

const News = new NewsHandler();

const router = express.Router();

router.get('/', News.listAllArticles.bind(News));

module.exports = router;
