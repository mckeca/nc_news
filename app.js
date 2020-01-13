const express = require('express');
const cors = require('cors');
const apiRouter = require('./routers/api-r');
const {
  customErrHandler,
  badPath,
  psqlErrors
} = require('./errors/err-handlers');

const app = express();

app.use(cors);

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', badPath);

app.use(customErrHandler);

app.use(psqlErrors);

module.exports = app;
