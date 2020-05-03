const router = require('express').Router();
const User = require('./user.model');
const usersService = require('./user.service');

router
  .route('/')
  .get(async (req, res) => {
    const users = await usersService.getAll();
    res.json(users.map(User.toResponse));
  })
  .post(async (req, res) => {
    const { name, login, password } = req.body;
    const newUser = new User({ name, login, password });
    await usersService.add(newUser);
    res.json(User.toResponse(newUser));
  });

router
  .route('/:id')
  .get(async (req, res) => {
    const user = await usersService.get(req.params.id);
    user ? res.json(User.toResponse(user)) : res.status(404).json();
  })
  .remove(async (req, res) => {
    // TODO
    res.status(404).json();
  });

module.exports = router;
