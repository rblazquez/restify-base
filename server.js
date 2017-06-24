/*global module:true, require:true, console:true, process:true */

'use strict';

var path = require('path');
var cluster = require('cluster');
var config = require('yaml-config');
var settings = config.readConfig(path.join(__dirname, 'config.yaml'));
var worker = require('./worker');
var logging = require('./logging');

// if process.env.NODE_ENV has not been set, default to development
var NODE_ENV = process.env.NODE_ENV || 'development';

exports.run = run;

function spawnWorker(logger) {
  // NOTE this is for development env
  // create servers
  var server = worker.createServer(logger);

  // start listening
  var port = settings.server.port || 8000;
  server.listen(port, function () {
    logger.info('%s listening at %s', server.name, server.url);
  });
}

function createCluster(logger) {
  // NOTE this is production mode
  // Set up cluster and start servers
  if (cluster.isMaster) {
    var numCpus = require('os').cpus().length;

    logger.info('Starting master, pid ' + process.pid + ', spawning ' + numCpus + ' workers');

    // fork workers
    for (var i = 0; i < numCpus; i++) {
      cluster.fork();
    }

    cluster.on('listening', function (worker) {
      logger.info('Worker ' + worker.id + ' started');
    });

    // if a worker dies, respawn
    cluster.on('death', function (worker) {
      logger.warn('Worker ' + worker.id + ' died, restarting...');
      cluster.fork();
    });
  }

  // Worker processes
  else {
    spawnWorker(logger);
  }
}

function run(cluster) {

  // Set up logging
  var logger = logging.createLogger(settings.logs);

  // In production environment, create a cluster
  if (NODE_ENV === 'production' || Boolean(settings.server.cluster) || cluster) {
    createCluster(logger);
  } else {
    spawnWorker(logger);
  }

}

run();
