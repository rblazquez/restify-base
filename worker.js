// jscs:disable requireTrailingComma
// jscs:disable requirePaddingNewLinesAfterBlocks
/*global module:true, require:true, console:true, process:true */

'use strict';

var path = require('path');
var restify = require('restify');
var config = require('yaml-config');
var settings = config.readConfig(path.join(__dirname, 'config.yaml'));

exports.createServer = createServer;

/*
 * Set up server
 * @return the created server
 */
function createServer(logger) {
  var config = {
    name: require(path.join(__dirname, 'package')).name,
    version: settings.default.server.version,
    acceptable: settings.default.server.acceptable,
  };

  if (logger) {
    config.log = logger;
  }

  var throttleOptions = {
    rate: settings.default.server.throttleRate,
    burst: settings.default.server.throttleBurst,
    ip: false,
    username: true
  };

  var server = restify.createServer(config);

  var plugins = [
    restify.acceptParser(server.acceptable),
    restify.throttle(throttleOptions),
    restify.dateParser(),
    restify.queryParser(),
    restify.fullResponse(),
    restify.bodyParser(),
    restify.gzipResponse()
  ];

  server.use(plugins);

  server.on('NotFound', function (req, res, next) {
    if (logger) {
      logger.debug('404', 'Request for ' + req.url + ' not found. No route.');
    }
    res.send(404, req.url + ' was not found');
  });

  if (logger) {
    server.on('after', restify.auditLogger({ log: logger }));
  }

  /**
   * DEFINE ROUTES
   */
  var registerRoute = function (route) {
    var routeMethod = route.meta.method.toLowerCase();
    var routeName = route.meta.name;
    var routeVersion = route.meta.version;

    route
      .meta
      .paths
      .forEach(function (aPath) {
        var routeMeta = {
          name: routeName,
          path: aPath,
          version: routeVersion
        };
        server[routeMethod](routeMeta, route.middleware);
      });
  };

  var setupMiddleware = function (middlewareName) {
    var routes = require(path.join(__dirname, 'controller', middlewareName));
    routes.forEach(registerRoute);
  };

  ['root', 'test'].forEach(setupMiddleware);

  return server;
}
