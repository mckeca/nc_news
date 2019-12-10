exports.badPath = (req, res, next) => {
  res.status(404).send({ msg: 'Page Not Found' });
};

exports.badMethod = (req, res, next) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.customErrHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  console.log(err);
  const errRef = {
    '22P02': [400, 'Bad Request - Invalid Data Type'],
    23502: [400, 'Bad Request - Violating Not Null Constraint'],
    42703: [404, 'Column Not Found'],
    23503: [404, 'Article Not Found']
  };
  if (!Object.keys(err).length) {
    res.status(400).send({ msg: 'Bad Request - Empty Body' });
  } else {
    res.status(errRef[err.code][0]).send({ msg: errRef[err.code][1] });
  }
};
