const connection = require('../db/connection');

const selectTopics = () => {
  return connection('topics').select('*');
};

const insertTopic = ({ description, slug }) => {
  const cleanTopic = { description, slug };
  return connection('topics')
    .insert(cleanTopic)
    .returning('*')
    .then(topicRows => {
      return topicRows[0];
    });
};

module.exports = { selectTopics, insertTopic };
