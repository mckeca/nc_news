const { updateCommentById, removeCommentById } = require('../models/comments-m')

exports.patchCommentById = (req, res, next) => {
    updateCommentById(req.body, req.params.comment_id)
        .then(updatedComment => {
            res.status(202).send({ updatedComment })
        })
        .catch(err => {
            next(err)
        })
}

exports.deleteCommentById = (req, res, next) => {
    removeCommentById(req.params.comment_id)
        .then(response => {
            res.sendStatus(204)
        })
        .catch(err => next(err))
}