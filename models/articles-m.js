const connection = require('../db/connection');

const checkValue = (value, column, table, rows) => {
  return connection
    .select('*')
    .from(`${table}`)
    .where(`${column}`, '=', `${value}`)
    .returning('*')
    .then(returnedRows => {
      if (!returnedRows.length) {
        const errString = `${table}`
          .replace(`${table}`[0], `${table}`[0].toUpperCase())
          .slice(0, table.length - 1)
        return Promise.reject({ status: 404, msg: `${errString} Not Found` })
      } else {
        return rows;
      }
    })
}

const selectArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  ...otherKeys
}) => {
  return connection
    .select('articles.article_id',
      'title',
      'articles.votes',
      'topic',
      'articles.author',
      'articles.created_at')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count({ comment_count: 'comments.article_id' })
    .groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .returning('*')
    .modify(query => {
      if (otherKeys['author']) {
        query.where('articles.author', '=', `${otherKeys.author}`)
      }
    })
    .modify(query => {
      if (otherKeys['topic']) {
        query.where('articles.topic', '=', `${otherKeys.topic}`);
      }
    })
    .then(rows => {
      if (!rows.length && otherKeys['author']) {
        return checkValue(`${otherKeys.author}`, 'username', 'users', rows)
      }
      if (!rows.length && otherKeys['topic']) {
        return checkValue(`${otherKeys.topic}`, 'slug', 'topics', rows)
      }
      return rows
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
    .then((articleRows) => {
      if (!articleRows.length) { return Promise.reject({ status: 404, msg: 'Article Not Found' }) }
      return articleRows[0]
    })
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
  insertCommentByArticle,
};
