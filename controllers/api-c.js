const rawEndpoints = require('../endpoints.json');

exports.getAllEndpoints = (req, res, next) => {
  if (!/\d+/.test(req.query.limit) || req.query.limit < 1) {
    req.query.limit = 10;
  }
  if (!/\d+/.test(req.query.page) || req.query.page < 1) {
    req.query.page = 1;
  }
  const { limit, page } = req.query
  const startIdx = (parseInt(page) - 1) * parseInt(limit);
  const pageArr = Object.entries(rawEndpoints).slice(startIdx, (startIdx + parseInt(limit)));
  const endpoints = {};
  pageArr.forEach(endpoint => {
    endpoints[endpoint[0]] = endpoint[1]
  })
  res.status(200).send({ endpoints })
};
