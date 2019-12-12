const connection = require('../db/connection');

const selectTopics = () => {
  return connection('topics').select('*');
};

const insertTopic = topic => {
  return connection('topics')
    .insert(topic)
    .returning('*')
    .then(topicRows => {
      return topicRows[0];
    });
};

module.exports = { selectTopics, insertTopic };
