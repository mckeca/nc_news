const express = require('express');
const apiRouter = require('./routers/api-r');
const { customErrHandler, badPath, psqlErrors } = require('./errors/err-handlers');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use('/*', badPath);

app.use(customErrHandler);

app.use(psqlErrors)

module.exports = app;
