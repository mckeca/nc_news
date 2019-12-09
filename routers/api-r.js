const apiRouter = require('express').Router();
const topicsRouter = require('./topics-r');
const articleRouter = require('./articles-r');

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articleRouter);

module.exports = apiRouter;
