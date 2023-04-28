require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.helper');
// checkOverload();

// routes

app.get('/', (req, res, next) => {
  const text = 'hello';
  return res.status(200).json({
    message: 'okay yeah',
    data: text.repeat(1000000),
  });
});

module.exports = app;
