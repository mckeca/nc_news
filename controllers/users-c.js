const selectUser = require('../models/users-m');

exports.getUserByUsername = (req, res, next) => {
  selectUser(req.params.username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(err => next(err));
};
