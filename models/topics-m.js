const connection = require('../db/connection');

const selectTopics = () => {
  return connection('topics')
    .select('*')
    .returning('*');
};

module.exports = selectTopics;
