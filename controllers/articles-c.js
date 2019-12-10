const {
  selectArticles,
  selectArticleById,
  updateArticle,
  selectCommentsByArticle,
  insertCommentByArticle
} = require('../models/articles-m');

exports.getArticles = (req, res, next) => {
  selectArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => next(err));
};

exports.getArticleById = (req, res, next) => {
  selectArticleById(req.params.article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.patchArticle = (req, res, next) => {
  updateArticle(req.params.article_id, req.body)
    .then(updatedArticle => {
      res.status(202).send({ updatedArticle });
    })
    .catch(err => {
      next(err);
    });
};

exports.getCommentsByArticle = (req, res, next) => {
  selectCommentsByArticle(
    req.params.article_id,
    req.query.sort_by,
    req.query.order
  )
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => {
      next(err);
    });
};

exports.postCommentToArticle = (req, res, next) => {
  insertCommentByArticle(req.body, req.params.article_id)
    .then(insertedComment => {
      res.status(201).send({ insertedComment });
    })
    .catch(err => {
      next(err);
    });
};
