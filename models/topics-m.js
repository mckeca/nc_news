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

const selectTopicBySlug = topic_slug => {
  return connection('topics')
    .select('*')
    .where('topics.slug', '=', topic_slug)
    .then(topicRows => {
      if (!topicRows.length)
        return Promise.reject({ status: 404, msg: 'Topic Not Found' });
      else return topicRows[0];
    });
};

module.exports = { selectTopics, selectTopicBySlug, insertTopic };
