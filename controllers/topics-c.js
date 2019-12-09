const selectTopics = require('../models/topics-m.js');

exports.getTopics = (req, res, next) => {
  console.log('into the controller');
  selectTopics()
    .then(topics => {
      console.log(topics);
      res.status(200).send({ topics });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
