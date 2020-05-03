const User = require('./user.model');

const users = [new User(), new User()];

const getAll = async () => {
  return users;
};

const get = async id => {
  return users.find(user => user.id === id);
};

const add = async user => {
  users.push(user);
  return user;
};

module.exports = { getAll, get, add };
