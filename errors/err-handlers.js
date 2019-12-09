exports.badPath = (req, res, next) => {
  res.status(404).send({ msg: 'Page Not Found' });
};

exports.badMethod = (req, res, next) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};
