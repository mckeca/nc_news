const apiRouter = require('express').Router();
const topicsRouter = require('./topics-r');
const articlesRouter = require('./articles-r');
const usersRouter = require('./users-r');
const commentsRouter = require('./comments-r')
const { badPath } = require('../errors/err-handlers');

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/teapot', (req, res, next) => {
    res.status(418).send({ msg: 'I\'m a teapot' })
})

apiRouter.use('/*', badPath);

module.exports = apiRouter;
