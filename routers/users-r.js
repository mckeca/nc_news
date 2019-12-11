const usersRouter = require('express').Router();
const { badMethod } = require('../errors/err-handlers');
const { getUserByUsername } = require('../controllers/users-c');

usersRouter.route('/').all(badMethod)

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(badMethod);

module.exports = usersRouter;
