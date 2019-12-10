const connection = require('../db/connection');

const updateCommentById = (newData, comment_id) => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .update(newData)
    .returning('*')
    .then(commentRows => {
      if (!commentRows.length)
        return Promise.reject({ status: 404, msg: 'Comment Not Found' });
      return commentRows[0];
    });
};

const removeCommentById = comment_id => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .del()
    .returning('*')
    .then(deletedComment => {
      if (!deletedComment.length)
        return Promise.reject({ status: 404, msg: 'Comment Not Found' });
    });
};

module.exports = { updateCommentById, removeCommentById };
