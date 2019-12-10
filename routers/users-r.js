const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users-c');

usersRouter.route('/:username').get(getUserByUsername);

module.exports = usersRouter;
