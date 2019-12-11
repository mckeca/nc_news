const commentsRouter = require('express').Router();
const { badMethod } = require('../errors/err-handlers');
const {
  patchCommentById,
  deleteCommentById
} = require('../controllers/comments-c');

commentsRouter.route('/').all(badMethod)

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(badMethod);

module.exports = commentsRouter;
