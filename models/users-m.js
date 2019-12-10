const connection = require('../db/connection');

const selectUser = username => {
  return connection('users')
    .select('*')
    .where('username', '=', username)
    .returning('*')
    .then(user => {
      if (!user.length)
        return Promise.reject({ status: 404, msg: 'User Not Found' });
      else return user[0];
    });
};

module.exports = selectUser;
