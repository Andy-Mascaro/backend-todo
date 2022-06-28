const { Router } = require('express');
const ClientService = require('../services/ClientService');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const client = await ClientService.create(req.body);
    res.json(client);
  } catch (e) {
    next(e);
  }
});
