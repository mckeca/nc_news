const connection = require('../db/connection');

// const updateCommentById = ({ inc_votes }, comment_id) => {
//   if (!inc_votes)
//     return Promise.reject({
//       status: 400,
//       msg: 'Bad Request - inc_votes not present'
//     });
//   return connection('comments')
//     .select('*')
//     .where('comment_id', '=', comment_id)
//     .returning('*')
//     .then(commentRows => {
//       if (!commentRows.length) {
//         return Promise.reject({ status: 404, msg: 'Comment Not Found' });
//       } else {
//         commentRows[0].votes += inc_votes;
//         if (commentRows[0].votes < 0) commentRows[0].votes = 0;
//         return commentRows[0];
//       }
//     })
//     .then(incrementedComment => {
//       return connection('comments')
//         .where('comment_id', '=', comment_id)
//         .update(incrementedComment)
//         .returning('*')
//         .then(updatedComment => {
//           return updatedComment[0];
//         });
//     });
// };

const updateCommentById = ({ inc_votes = 0 }, comment_id) => {
  return connection('comments')
    .increment('votes', inc_votes)
    .where('comment_id', '=', comment_id)
    .returning('*')
    .then((commentRows) => {
      if (!commentRows.length) { return Promise.reject({ status: 404, msg: 'Comment Not Found' }) }
      return commentRows[0]
    })
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
