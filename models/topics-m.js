const selectTopics = () => {
  console.log('into the model');
  return knex.select('*').from('topics');
};

module.exports = selectTopics;
