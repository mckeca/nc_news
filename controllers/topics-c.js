const {
  selectTopics,
  selectTopicBySlug,
  insertTopic
} = require('../models/topics-m.js');

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(err => next(err));
};

exports.postTopic = (req, res, next) => {
  insertTopic(req.body)
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(err => next(err));
};

exports.getTopicBySlug = (req, res, next) => {
  selectTopicBySlug(req.params.topic_slug)
    .then(topic => {
      res.status(200).send({ topic });
    })
    .catch(err => next(err));
};
