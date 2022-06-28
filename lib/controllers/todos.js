const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Todo = require('../models/Todo');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    const newTodo = await Todo.insert({
      ...req.body,
      client_id: req.client.id,
    });
    res.json(newTodo);
  } catch (e) {
    next(e);
  }
});
