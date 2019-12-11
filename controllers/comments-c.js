const {
  updateComment,
  removeComment
} = require('../models/comments-m');

exports.patchComment = (req, res, next) => {
  updateComment(req.body, req.params.comment_id)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
  removeComment(req.params.comment_id)
    .then(response => {
      res.sendStatus(204);
    })
    .catch(err => next(err));
};
