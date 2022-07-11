const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const ClientService = require('../services/ClientService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const client = await ClientService.create(req.body);
      res.json(client);
    } catch (e) {
      next(e);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const sessionToken = await ClientService.signIn({ email, password });
      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Log in complete' });
    } catch (e) {
      console.log('test error', e);
      next(e);
    }
  })
  .get('/person', authenticate, (req, res) => {
    res.json(req.client);
  });
