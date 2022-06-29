const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Todo = require('../models/Todo');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const todoList = await Todo.getById(req.client.id);
      res.json(todoList);
    } catch (e) {
      next(e);
    }
  })

  .post('/', authenticate, async (req, res, next) => {
    try {
      const newTodo = await Todo.insert({
        ...req.body,
        client_id: req.client.id,
      });
      res.json(newTodo);
    } catch (e) {
      next(e);
    }
  })

  .put('/:id', [authenticate, authorize], async (req, res, next) => {
    try {
      const fixTodo = await Todo.updateById(req.params.id, req.body);
      res.json(fixTodo);
    } catch (e) {
      next(e);
    }
  });
