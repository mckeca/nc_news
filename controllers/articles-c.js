const {
  selectArticles,
  selectArticleById,
  updateArticle,
  selectCommentsByArticle,
  insertCommentByArticle,
  insertArticle,
  removeArticle
} = require('../models/articles-m');

exports.getArticles = (req, res, next) => {
  if (!/\d+/.test(req.query.limit) || req.query.limit < 1) {
    req.query.limit = 10;
  }
  if (!/\d+/.test(req.query.page) || req.query.page < 1) {
    req.query.page = 1;
  }
  selectArticles(req.query)
    .then(page => {
      res.status(200).send(page);
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
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(err => next(err));
};

exports.deleteArticle = (req, res, next) => {
  removeArticle(req.params.article_id)
    .then(response => {
      res.sendStatus(204);
    })
    .catch(err => next(err));
};

exports.getCommentsByArticle = (req, res, next) => {
  if (!/\d+/.test(req.query.limit) || req.query.limit < 1) {
    req.query.limit = 10;
  }
  if (!/\d+/.test(req.query.page) || req.query.page < 1) {
    req.query.page = 1;
  }
  selectCommentsByArticle(req.params.article_id, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};

exports.postCommentToArticle = (req, res, next) => {
  insertCommentByArticle(req.body, req.params.article_id)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => next(err));
};
