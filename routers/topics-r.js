const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics-c');

topicsRouter.get('/', getTopics);

module.exports = topicsRouter;
