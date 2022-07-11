const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/clients', require('./controllers/clients'));
app.use('/api/v1/todos', require('./controllers/todos'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
