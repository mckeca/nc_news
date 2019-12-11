exports.getAllEndpoints = (req, res, next) => {
  res.sendFile('/endpoints.json', { root: __dirname }, err => {
    console.log(err);
    next(err);
  });
};
