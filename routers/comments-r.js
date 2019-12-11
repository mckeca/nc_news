const commentsRouter = require('express').Router();
const { badMethod } = require('../errors/err-handlers');
const {
  patchComment,
  deleteComment
} = require('../controllers/comments-c');

commentsRouter.route('/').all(badMethod)

commentsRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(badMethod);

module.exports = commentsRouter;
