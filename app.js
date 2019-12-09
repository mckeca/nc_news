const express = require('express');
const apiRouter = require('./routers/api-r');

const app = express();

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Page Not Found' });
});

module.exports = app;
