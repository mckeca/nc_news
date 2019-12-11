const connection = require('../db/connection');

const updateComment = ({ inc_votes = 0 }, comment_id) => {
  return connection('comments')
    .increment('votes', inc_votes)
    .where('comment_id', '=', comment_id)
    .returning('*')
    .then((commentRows) => {
      if (!commentRows.length) { return Promise.reject({ status: 404, msg: 'Comment Not Found' }) }
      return commentRows[0]
    })
};

const removeComment = comment_id => {
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .del()
    .returning('*')
    .then(deletedComment => {
      if (!deletedComment.length)
        return Promise.reject({ status: 404, msg: 'Comment Not Found' });
    });
};

module.exports = { updateComment, removeComment };
