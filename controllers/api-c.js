const JSONendpoints = require('../endpoints.json');

const endpoints = JSON.parse(JSONendpoints);

exports.getAllEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};
