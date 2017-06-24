// jscs:disable requireTrailingComma
'use strict';

/**
 * Routes
 */
var routes = [];

/**
 * GET /
 * Version: 1.0.0
 */
routes.push({
  meta: {
    name: 'getTest',
    method: 'GET',
    paths: [
      '/test'
    ],
    version: '1.0.0'
  },
  middleware: function (req, res, next) {
    res.send({ result: 'test' });
    return next();
  }
});

/**
 * Export
 */
module.exports = routes;
