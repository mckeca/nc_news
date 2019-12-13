const connection = require('../db/connection');

const checkValue = (value, column, table, rows) => {
  return connection
    .select('*')
    .from(`${table}`)
    .where(`${column}`, '=', `${value}`)
    .then(returnedRows => {
      if (!returnedRows.length) {
        const errString = `${table}`
          .replace(`${table}`[0], `${table}`[0].toUpperCase())
          .slice(0, table.length - 1);
        return Promise.reject({ status: 404, msg: `${errString} Not Found` });
      } else {
        return rows;
      }
    });
};

const selectArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  page = 1,
  ...otherKeys
}) => {

  return connection
    .select(
      'articles.article_id',
      'title',
      'articles.votes',
      'topic',
      'articles.author',
      'articles.created_at'
    )
    .from('articles')
    .limit(limit)
    .offset((page - 1) * limit)
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count({ comment_count: 'comments.article_id' })
    .groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .modify(query => {
      if (otherKeys.author) {
        query.where('articles.author', '=', otherKeys.author);
      }
      if (otherKeys.topic) {
        query.where('articles.topic', '=', otherKeys.topic);
      }
    })
    .then(rows => {
      if (!rows.length && otherKeys.author) {
        return checkValue(otherKeys.author, 'username', 'users', rows);
      }
      if (!rows.length && otherKeys.topic) {
        return checkValue(otherKeys.topic, 'slug', 'topics', rows);
      }
      return rows
    })
    .then(rows => {
      const totalRows = connection('articles').select('article_id')
        .modify(query => {
          if (otherKeys.author) {
            query.where('articles.author', '=', otherKeys.author);
          }
          if (otherKeys.topic) {
            query.where('articles.topic', '=', otherKeys.topic);
          }
        })
      return Promise.all([totalRows, rows]);
    })
    .then(([totalRows, articles]) => {
      const total_count = totalRows.length;
      return { articles, total_count };
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

const updateArticle = (article_id, { inc_votes = 0 }) => {
  return connection('articles')
    .increment('votes', inc_votes)
    .where('article_id', '=', article_id)
    .returning('*')
    .then(articleRows => {
      if (!articleRows.length) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      }
      return articleRows[0];
    });
};

const insertArticle = ({ title, topic, author, body }) => {
  const cleanArticle = { title, topic, author, body };
  return connection('articles')
    .insert(cleanArticle)
    .returning('*')
    .then(articleRows => {
      return articleRows[0];
    });
};

const removeArticle = article_id => {
  return connection('articles')
    .where('article_id', '=', article_id)
    .del()
    .returning('*')
    .then(deletedArticle => {
      if (!deletedArticle.length)
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
    });
};

const selectCommentsByArticle = (
  article_id,
  { sort_by = 'created_at', order = 'desc', limit = 0, page = 1 }
) => {
  return connection('comments')
    .where('article_id', '=', article_id)
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((page - 1) * limit)
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
  const cleanComment = { body: body, author: username, article_id: article_id };
  return connection('comments')
    .insert(cleanComment)
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
  insertCommentByArticle,
  insertArticle,
  removeArticle
};
