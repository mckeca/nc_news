const topicsRouter = require('express').Router();
const { getTopics, postTopic } = require('../controllers/topics-c');
const { badMethod } = require('../errors/err-handlers');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)
  .all(badMethod);

module.exports = topicsRouter;
