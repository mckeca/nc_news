const apiRouter = require('express').Router();
const topicsRouter = require('./topics-r');

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
