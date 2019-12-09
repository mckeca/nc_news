const knex = require('knex');

const selectTopics = () => {
  console.log('into the model');
  return knex('topics')
    .select('*')
    .returning('*');
};

module.exports = selectTopics;
