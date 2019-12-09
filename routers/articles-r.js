const articlesRouter = require('express').Router();
const { getArticles } = require('../controllers/articles-c');
const { badMethod } = require('../errors/err-handlers');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(badMethod);

module.exports = articlesRouter;
