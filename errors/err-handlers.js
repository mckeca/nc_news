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
  const errRef = {
    '22P02': { status: 400, msg: 'Bad Request - Invalid Data Type' },
    23502: { status: 400, msg: 'Bad Request - Violating Not Null Constraint' },
    42703: { status: 400, msg: 'Bad Request - Cannot Sort By Non Existent Column' },
    23503: { status: 404, msg: 'Article Not Found' }
  };
  if (!Object.keys(err).length) {
    res.status(400).send({ msg: 'Bad Request - Empty Body' });
  } else {
    res.status(errRef[err.code].status).send({ msg: errRef[err.code].msg });
  }
};
