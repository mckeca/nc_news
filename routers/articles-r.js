const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  patchArticle,
  getCommentsByArticle,
  postCommentToArticle,
  postArticle,
  deleteArticle
} = require('../controllers/articles-c');
const { badMethod } = require('../errors/err-handlers');

articlesRouter
  .route('/')
  .get(getArticles)
  .post(postArticle)
  .all(badMethod);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle)
  .all(badMethod);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(postCommentToArticle)
  .all(badMethod);

module.exports = articlesRouter;
