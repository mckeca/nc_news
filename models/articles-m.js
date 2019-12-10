const connection = require('../db/connection');

const selectArticles = () => {
  return connection('articles')
    .select('*')
    .returning('*');
};

const selectArticleById = article_id => {
  return connection('articles')
    .select('*')
    .where('article_id', '=', article_id)
    .returning('*')
    .then(articleRows => {
      if (!articleRows.length)
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      else return articleRows[0];
    });
};

const updateArticle = (article_id, newData) => {
  return connection('articles')
    .where('article_id', '=', article_id)
    .update(newData)
    .returning('*')
    .then(articleRows => {
      if (!articleRows.length)
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      return articleRows[0];
    });
};

const selectCommentsByArticle = article_id => {
  return connection('comments')
    .where('article_id', '=', article_id)
    .returning('*')
    .then(commentRows => {
      const checkArticle = connection('articles')
        .select('title')
        .where('article_id', '=', article_id)
        .returning('*');
      return Promise.all([checkArticle, commentRows]);
    })
    .then(([articleRows, commentRows]) => {
      if (!articleRows.length)
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      else return commentRows;
    });
};

const insertCommentByArticle = (comment, article_id) => {
  const fullComment = { ...comment, article_id: article_id };
  return connection('comments')
    .insert(fullComment)
    .returning('*')
    .then(commentRows => {
      return commentRows[0];
    });
};

module.exports = {
  selectArticles,
  selectArticleById,
  updateArticle,
  selectCommentsByArticle,
  insertCommentByArticle
};
