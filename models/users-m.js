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

const insertUser = ({ username, name, avatar_url }) => {
  const cleanUser = { username, name, avatar_url };
  return connection('users')
    .insert(cleanUser)
    .returning('*')
    .then(userRows => {
      return userRows[0];
    });
};

const selectAllUsers = () => {
  return connection('users')
    .select('*')
    .returning('*')
    .then(users => {
      return users.map(({ name, ...otherKeys }) => {
        return { ...otherKeys };
      });
    });
};

module.exports = { selectUser, insertUser, selectAllUsers };
