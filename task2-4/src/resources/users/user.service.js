const usersRepo = require('./user.memory.repository');

const getAll = () => usersRepo.getAll();
const get = id => usersRepo.get(id);
const add = user => usersRepo.add(user);

module.exports = { getAll, get, add };
