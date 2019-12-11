const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  patchArticle,
  getCommentsByArticle,
  postCommentToArticle
} = require('../controllers/articles-c');
const { badMethod } = require('../errors/err-handlers');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(badMethod);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)
  .all(badMethod);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(postCommentToArticle)
  .all(badMethod);

module.exports = articlesRouter;
