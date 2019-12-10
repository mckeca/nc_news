const connection = require('../db/connection');

const selectArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  ...otherKeys
}) => {
  return connection
    .select('articles.*')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count({ comment_count: 'comments.article_id' })
    .groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .modify(query => {
      if (otherKeys['author']) {
        query.where('articles.author', '=', `${otherKeys['author']}`);
      }
    })
    .modify(query => {
      if (otherKeys['topic']) {
        query.where('articles.topic', '=', `${otherKeys['topic']}`);
      }
    })
    .returning('*')
    .then(rows => {
      return rows.map(({ body, ...otherKeys }) => {
        return { ...otherKeys };
      });
    });
};

const selectArticleById = article_id => {
  return connection
    .select('articles.*')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', '=', article_id)
    .count({ comment_count: 'comments.article_id' })
    .groupBy('articles.article_id')
    .returning('*')
    .then(articleRows => {
      if (!articleRows.length)
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      else return articleRows[0];
    });
};

const updateArticle = (article_id, { inc_votes }) => {
  if (!inc_votes)
    return Promise.reject({
      status: 400,
      msg: 'Bad Request - inc_votes not present'
    });
  return connection('articles')
    .select('*')
    .where('article_id', '=', article_id)
    .returning('*')
    .then(articleRows => {
      if (!articleRows.length) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      } else {
        articleRows[0].votes += inc_votes;
        if (articleRows[0].votes < 0) articleRows[0].votes = 0;
        return articleRows[0];
      }
    })
    .then(incrementedArticle => {
      return connection('articles')
        .where('article_id', '=', article_id)
        .update(incrementedArticle)
        .returning('*')
        .then(updatedArticle => {
          return updatedArticle[0];
        });
    });
};

const selectCommentsByArticle = (
  article_id,
  sort_by = 'created_at',
  order = 'desc'
) => {
  return connection('comments')
    .where('article_id', '=', article_id)
    .orderBy(sort_by, order)
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
      else
        return commentRows.map(({ article_id, ...otherKeys }) => {
          return { ...otherKeys };
        });
    });
};

const insertCommentByArticle = ({ username, body }, article_id) => {
  const newComment = { body: body, author: username, article_id: article_id };
  return connection('comments')
    .insert(newComment)
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
