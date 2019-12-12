const { selectUser, insertUser, selectAllUsers } = require('../models/users-m');

exports.getUserByUsername = (req, res, next) => {
  selectUser(req.params.username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(err => next(err));
};

exports.postUser = (req, res, next) => {
  insertUser(req.body)
    .then(user => {
      res.status(201).send({ user });
    })
    .catch(err => next(err));
};

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(err => next(err));
};
