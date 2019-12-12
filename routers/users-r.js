const usersRouter = require('express').Router();
const { badMethod } = require('../errors/err-handlers');
const {
  getAllUsers,
  postUser,
  getUserByUsername
} = require('../controllers/users-c');

usersRouter
  .route('/')
  .get(getAllUsers)
  .post(postUser)
  .all(badMethod);

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(badMethod);

module.exports = usersRouter;
