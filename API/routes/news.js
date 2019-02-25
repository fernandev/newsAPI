const express = require('express');
const NewsHandler = require('../handlers/news');
const newsValidator = require('../validators/news');

const News = new NewsHandler();

const router = express.Router();

router.get('/', newsValidator.validate('listAllArticles'), News.listAllArticles.bind(News));
router.get('/recent', newsValidator.validate('listAllArticles'), News.listRecentArticles.bind(News));
router.get('/popular', newsValidator.validate('listAllArticles'), News.listPopularArticles.bind(News));
router.get('/:id', newsValidator.validate('filterArticleById'), News.findArticleById.bind(News));
router.patch('/:id/like', newsValidator.validate('filterArticleById'), News.computeArticleLikes.bind(News));

module.exports = router;
