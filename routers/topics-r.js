const topicsRouter = require('express').Router();
const {
  getTopics,
  postTopic,
  getTopicBySlug
} = require('../controllers/topics-c');
const { badMethod } = require('../errors/err-handlers');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic)
  .all(badMethod);

topicsRouter
  .route('/:topic_slug')
  .get(getTopicBySlug)
  .all(badMethod);

module.exports = topicsRouter;
