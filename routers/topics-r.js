const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics-c');
const { badMethod } = require('../errors/err-handlers');

topicsRouter
  .route('/')
  .get(getTopics)
  .all(badMethod);

module.exports = topicsRouter;
