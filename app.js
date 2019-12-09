const express = require('express');
const apiRouter = require('./routers/api-r');
const { badPath } = require('./errors/err-handlers');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use('/*', badPath);

module.exports = app;
