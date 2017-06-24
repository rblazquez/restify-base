/*global module:true, require:true */

'use strict';

var fs = require('fs');
var path = require('path');
var config = require('yaml-config');
var bunyan = require('bunyan');

exports.createLogger = createLogger;

/*
 * configure and start logging
 * @param {Object} config The configuration object for defining dir: log directory, level: loglevel
 * @return the created logger instance
 */
function createLogger(config) {

  var pkg = require(path.join(__dirname, 'package'));
  var appName = pkg.name;
  var appVersion = pkg.version;
  var logDir = config.dir || path.join(__dirname, 'logs');
  var logFile = path.join(logDir, appName + '-log.json');
  var logErrorFile = path.join(logDir, appName + '-errors.json');
  var logLevel = config.level || 'debug';

  // Create log directory if it doesnt exist
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  // Log to console and log file
  var log = bunyan.createLogger({
    name: appName, streams: [
      {
        stream: process.stdout, level: 'warn',
      }, {
        path: logFile, level: logLevel, type: 'rotating-file', period: '1d',
      }, {
        path: logErrorFile, level: 'error',
      },
    ], serializers: bunyan.stdSerializers,
  });

  log.info('Starting ' + appName + ', version ' + appVersion);
  log.info('Environment set to ' + process.env.NODE_ENV);
  log.debug('Logging setup completed.');

  return log;
}
