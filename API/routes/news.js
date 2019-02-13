const express = require('express');
const NewsHandler = require('../handlers/news');
const newsValidator = require('../validators/news');

const News = new NewsHandler();

const router = express.Router();

router.get('/', newsValidator.validate('listAllArticles'), News.listAllArticles.bind(News));

module.exports = router;
